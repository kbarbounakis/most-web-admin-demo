/**
 * MOST Web Framework Controller
 * Created by kbarbounakis on 3/9/16.
 */
/**
 * @private
 */
var web = require("most-web"), util = require("util");
/**
 * @constructor
 * @augments {HttpBaseController}
 */
function ExamplesController() {
    ExamplesController.super_.call(this);
}
util.inherits(ExamplesController, web.controllers.HttpBaseController);

ExamplesController.prototype.lorem = function (callback) {
  var lorem = require("./../../lib/lorem")  ;
    return callback(null, this.json( {lorem:lorem.generate()} ));
};

ExamplesController.prototype.lockscreen = function (callback) {
    var self = this, context = self.context;
    context.handle("GET", function() {
        context.model("User").where("name").equal(context.user.name).first().then(function(result) {
            context.application.setAuthCookie(context, "anonymous");
            return callback(null, self.view({user:result}));
        }).catch(function(err) {
            web.common.log(err);
            return callback(new web.common.HttpServerError());
        });
    }).handle("POST", function() {
        ////validate anti-forgery
        //self.context.validateAntiForgeryToken();
        var auth = self.context.application.module.service('$auth')(self.context);
        auth.login(context.params.username, context.params.password, function(err) {
            if (err) {
                web.common.log(err);
                context.model("User").where("name").equal(context.params.username).silent().first().then(function(result) {
                    if (web.common.isNullOrUndefined(result)) {
                        return callback(null, self.redirect('/'));
                    }
                    if ((err instanceof web.common.HttpUnauthorizedException) || (err instanceof web.common.HttpForbiddenException)) {
                        callback(null, self.view({user:result, message:err.message, status:err.status, substatus: err.substatus}));
                    }
                    else {
                        callback(null, self.view({user:result,message:'Login failed due to server error. Please try again or contact system administrator.'}));
                    }
                }).catch(function(err) {
                    return callback(new web.common.HttpBadRequest());
                });

            }
            else {
                return callback(null, self.redirect('/'));
            }
        });

    }).unhandle(function() {
        return callback(new web.common.HttpBadRequest());
    })

};

if (typeof module !== 'undefined') module.exports = ExamplesController;