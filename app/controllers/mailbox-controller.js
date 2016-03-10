/**
 * MOST Web Framework Controller for UserMailbox
 * Created by kbarbounakis on 2015-11-23.
 */
var util = require('util'),
    web = require('most-web');
/**
 * Represents the HTTP data controller of the UserMailbox model.
 * @class UserMailboxController
 * @constructor
 * @augments {HttpDataController}
 */
function UserMailboxController() {
    UserMailboxController.super_.call(this);
}
util.inherits(UserMailboxController, web.controllers.HttpDataController);

UserMailboxController.prototype.read = function (callback) {
    var self = this, context = self.context;
    context.handle('GET', function() {
        context.model('UserMailbox').where('message').equal(context.params.message).first().then(function(result) {
            return callback(null, self.result(result));
        }).catch(function(err) {
            return callback(new web.common.HttpServerError('An internal server error occured while reading message.'));
        });
    }).unhandle(function() {
       return callback(new web.common.HttpMethodNotAllowed());
    });
};

if (typeof module !== 'undefined') module.exports = UserMailboxController;