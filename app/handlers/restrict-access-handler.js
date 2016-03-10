/**
 * Created by Kyriakos on 25/9/2014.
 */
var web = require('most-web'), url = require('url');
/**
 * @class LocationSetting
 * @constructor
 */
function LocationSetting() {
    /**
     * Gets or sets a string that represents the description of this object
     * @type {string}
     */
    this.description = null;
    /**
     * Gets or sets a string that represents the target path associated with access settings.
     * @type {*}
     */
    this.path = null;
    /**
     * Gets or sets a comma delimited string that represents the collection of users or groups where this access setting will be applied. A wildcard (*) may be used.
     * @type {*}
     */
    this.allow = null;
    /**
     * Gets or sets a string that represents the collection of users or groups where this access setting will be applied. A wildcard (*) may be used.
     * @type {*}
     */
    this.deny = null;
}
/**
 * @class RestrictHandler
 * @constructor
 * @augments HttpHandler
 */
function RestrictHandler() {
    //
}
/**
 * Authenticates an HTTP request and sets user or anonymous identity.
 * @param {HttpContext} context
 * @param {Function} callback
 */
RestrictHandler.prototype.authorizeRequest = function (context, callback) {
    try {
        if (context.request.method === 'OPTIONS') {
            return callback();
        }
        if (context.user.name=='anonymous')
        {
            RestrictHandler.prototype.isRestricted(context, function(err, result) {
                if (err) {
                    web.common.log(err);
                    callback(new web.common.HttpUnauthorizedException('Access denied'));
                }
                else if (result) {
                    var er = new web.common.HttpUnauthorizedException();
                    context.application.errors.unauthorized(context,er,function(err) {
                        if (err) {
                            return callback(err);
                        }
                        context.response.end();
                        return callback(er);
                    });
                }
                else {
                    callback();
                }
            });
        }
        else {
            callback();
        }
    }
    catch (e) {
        callback(e);
    }
};

RestrictHandler.prototype.isNotRestricted = function(context, callback) {
    try {
        if (web.common.isNullOrUndefined(context)) {
            return callback(new web.common.HttpBadRequest());
        }
        if (web.common.isNullOrUndefined(context.request)) {
            return callback(new web.common.HttpBadRequest());
        }
        //ensure settings (and auth settings)
        context.application.config.settings = context.application.config.settings || {};
        /**
         * @type {{loginPage:string=,locations:Array}|*}
         */
        context.application.config.settings.auth = context.application.config.settings.auth || {};
        //get login page, request url and locations
        var loginPage = context.application.config.settings.auth.loginPage || '/login.html',
            requestUrl = url.parse(context.request.url),
            locations = context.application.config.settings.auth.locations || [];
        if (requestUrl.pathname===loginPage) {
            return callback(null, true);
        }
        for (var i = 0; i < locations.length; i++) {
            /**
             * @type {*|LocationSetting}
             */
            var location = locations[i];
            if (/\*$/.test(location.path)) {
                //wildcard search /something/*
                if ((requestUrl.pathname.indexOf(location.path.replace(/\*$/,''))==0) && (location.allow=='*')) {
                    return callback(null, true);
                }
            }
            else {
                if ((requestUrl.pathname===location.path) && (location.allow=='*')) {
                    return callback(null, true);
                }
            }
        }
        return callback(null, false);
    }
    catch(e) {
        web.common.log(e);
        return callback(null, false);
    }

};

RestrictHandler.prototype.isRestricted = function(context, callback) {
    RestrictHandler.prototype.isNotRestricted(context, function(err, result) {
        if (err) { return callback(err); }
        callback(null, !result);
    });
};

/**
 * Creates a new instance of AuthHandler class
 * @returns {RestrictHandler}
 */
RestrictHandler.createInstance = function() {
    return new RestrictHandler();
};

if (typeof exports !== 'undefined') {
    module.exports.createInstance = RestrictHandler.createInstance;
    /**
     * @constructs {RestrictHandler}
     */
    module.exports.RestrictHandler = RestrictHandler;
}