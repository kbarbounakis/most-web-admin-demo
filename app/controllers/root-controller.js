/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */
'use strict';

var util = require('util'),
    fs = require('fs'),
    web = require('most-web'),
    path = require('path'),
    url = require('url'),
    querystring = require('querystring');

function queryReturnUrl() {
    /**
     * @type {HttpContext|*}
     */
    var self = this;
    var returnUrl = self.params['return'] || self.params['returnUrl'];
    if (web.common.isNullOrUndefined(returnUrl)) {
        //validate referrer
        var referer = self.request.headers.referer;
        if (referer) {
            var refererUri = url.parse(referer);
            if (refererUri.query) {
                var query = querystring.parse(refererUri.query);
                returnUrl=query.returnUrl;
            }
        }
    }
    return returnUrl || '/';
}

/**
 * Root HTTP Controller class
 * @constructor
 * @augments {HttpController}
 */
function RootController() {
    //
}
util.inherits(RootController, web.controllers.HttpBaseController);

RootController.prototype.index = function(callback)
{
    callback(null, this.view());
};

RootController.prototype.browserUsage = function(callback)
{
    callback(null, this.result({}));
};

RootController.prototype.runtime = function(callback)
{
    callback(null, this.result({
        cpu: web.common.randomInt(0,99),
        likes: web.common.randomInt(1000, 9000),
        sales: web.common.randomInt(50, 240),
        members:web.common.randomInt(100, 540)
    }));
};

RootController.prototype.sidebar = function(callback)
{
    var self = this, context = self.context;
    context.model('Person').filter('id eq person()', function(err, q) {
       if (err) { return callback(err); }
        q.first().then(function(result) {
            callback(null, self.result(result));
        }).catch(function(err) {
            callback(err);
        });
    });
};

RootController.prototype.home = function(callback)
{
    var self = this, context = self.context;
    if (context.user.name !== 'anonymous') {
        return callback(null, self.redirect('/index.html'));
    }
    else {
        return callback(null, self.redirect('/login.html'));
    }
};

RootController.prototype.header = function(callback)
{
    var self = this, context = self.context;
    context.model('Person').where('user/name').equal(context.user.name).first().then(function(result) {
        callback(null, self.view(result));
    }).catch(function(err) {
        callback(err);
    });
};

RootController.prototype.locale = function(callback)
{
    var self = this;
    self.context.handle('GET', function() {
        if (self.context.format!='js') {
            self.context.handled = false;
            return;
        }
        try {
            //first of all get context language
            var culture = self.context.culture(),
                resource = self.context.params['resource'],
                resourcePath = web.current.mapPath('/locales/'.concat(resource, '.', culture.toLowerCase(),'.json'));
            //valdate file existance
            fs.exists(resourcePath, function(exists) {
                if (exists) {
                    var unmodifiedRequest = self.context.currentHandler.unmodifiedRequest || web.current.unmodifiedRequest || function(a,b,cb) { cb(null, false) };
                    unmodifiedRequest(self.context, resourcePath, function(err, result) {
                        if (result) {
                            self.context.response.writeHead(304);
                            callback(null,self.empty());
                        }
                        else {

                            //read file
                            fs.readFile(resourcePath, 'utf8', function(err, data) {
                                //and return JS script
                                try {

                                    web.current.resolveETag = web.current.resolveETag || function(a,cb) { cb(); };
                                    web.current.resolveETag(resourcePath, function(err, result) {
                                        if (result)
                                            self.context.response.setHeader('ETag' , result);
                                        callback(null,self.result('window.locales = window.locales || {}; window.locales.' + resource + '=' + data + ';'));
                                    });
                                }
                                catch (e) {
                                    console.log(e);
                                    //otherwise throw NOT FOUND exception
                                    callback(new web.common.HttpException());
                                }
                            });
                        }
                    });
                }
                else {
                    //otherwise throw NOT FOUND exception
                    callback(new web.common.HttpNotFoundException());
                }
            });
        }
        catch (e) {
            console.log(e);
            //otherwise throw NOT FOUND exception
            callback(new web.common.HttpException());
        }


    }).unhandle(function() {
        callback(new web.common.HttpMethodNotAllowed());
    });
};

RootController.prototype.routes = function(callback)
{
    var self = this;
    self.context.handle('GET', function() {
        if (self.context.format!='js') {
            self.context.handled = false;
            return;
        }
        try {
            //first of all get context language
            var resourcePath = path.join(process.cwd(),'config','routes.json');
            //validate file existence
            fs.exists(resourcePath, function(exists) {
                if (exists) {
                    var unmodifiedRequest = self.context.currentHandler.unmodifiedRequest || web.current.unmodifiedRequest || function(a,b,cb) { cb(null, false); };
                    unmodifiedRequest(self.context, resourcePath, function(err, result) {
                        if (result) {
                            self.context.response.writeHead(304);
                            callback(null,self.empty());
                        }
                        else {
                            //read file
                            fs.readFile(resourcePath, 'utf8', function(err, data) {
                                //and return JS script
                                try {
                                    web.current.resolveETag = web.current.resolveETag || function(a,cb) { cb(); };
                                    web.current.resolveETag(resourcePath, function(err, result) {
                                        if (result)
                                            self.context.response.setHeader('ETag' , result);
                                        callback(null,self.result('window.routes = ' + data + ';'));
                                    });
                                }
                                catch (e) {
                                    console.log(e);
                                    //otherwise throw NOT FOUND exception
                                    callback(new web.common.HttpException());
                                }
                            });
                        }
                    });
                }
                else {
                    //otherwise throw NOT FOUND exception
                    callback(new web.common.HttpNotFoundException());
                }
            });
        }
        catch (e) {
            console.log(e);
            //otherwise throw NOT FOUND exception
            callback(new web.common.HttpException());
        }


    }).unhandle(function() {
        callback(new web.common.HttpMethodNotAllowed());
    });
};

RootController.prototype.login = function(callback)
{
    var self = this, context = self.context;
    if (this.context.is('POST')) {
        //validate anti-forgery token
        self.context.validateAntiForgeryToken();
        //try to login
        var credentials = self.context.params;
        if (typeof credentials.password !== 'string') {
            callback(new web.common.HttpBadRequest());
            return;
        }
        var requestPassword = credentials.password.replace(/(^\s*|\s*$)/g, '');
        if (requestPassword.length===0) {
            callback(null, self.view({message:'Login failed due to server error. User password cannot be empty.'}));
            return;
        }
        //validate user name
        if (/^[A-Za-z0-9_\.\-@]+$/.test(credentials.username)==false) {
            callback(null, self.view({message:'Login failed due to server error. The user name may contains one or more illegal characters. Please contact your system administrator.'}));
            return;
        }
        //init auth provider
        var auth = self.context.application.module.service('$auth')(self.context);
        auth.login(credentials.username, requestPassword, function(err) {
            if (err) {
                web.common.log(err);
                if ((err instanceof web.common.HttpUnauthorizedException) || (err instanceof web.common.HttpForbiddenException)) {
                    callback(null, self.view({message:err.message, status:err.status, substatus: err.substatus}));
                }
                else {
                    callback(null, self.view({message:'Login failed due to server error. Please try again or contact system administrator.'}));
                }
            }
            else {
                var returnUrl = queryReturnUrl.call(self.context);
                if (web.common.isRelativeUrl(returnUrl)) {
                    return callback(null, self.redirect(returnUrl));
                }
                else {
                    return callback(null, self.redirect('/index.html'));
                }
            }
        });
    }
    else {
        return callback(null, self.view());
    }
};

RootController.prototype.logout = function(callback)
{
    var self = this;
    web.current.setAuthCookie(self.context, 'anonymous');
    self.context.params.return = self.context.params.return || '/login.html';
    callback(null, self.redirect(queryReturnUrl.call(self.context)));
};

if (typeof module !== 'undefined') module.exports = RootController;
