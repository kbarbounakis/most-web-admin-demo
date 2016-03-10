/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 23/12/2014.
 */
/**
 * Created by kbarbounakis on 24/6/2014.
 */
var util = require('util'),
    web = require('most-web'),
    dat = require('most-data'),
    DataModel = dat.classes.DataModel,
    /**
     * @function
     * @returns {Moment}
     */
    moment = require('moment');

var resolver =
{
    me:function(callback) {
        /**
         * @type {DataModel|*}
         */
        var self = this, undefinedUser = 0;
        if (self.context) {
            var user = self.context.user || { name:'anonymous' };
            if (web.common.isNullOrUndefined(user.id)) {
                //get user id
                self.context.model('User').where('name').equal(user.name).select('id').first(function(err, result) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        if (web.common.isNullOrUndefined(result)) {
                            callback(null, undefinedUser);
                        }
                        else {
                            callback(null, result.id);
                        }
                    }
                });
            }
            else {
                callback(null, user.id);
            }
        }
        else {
            callback(null, undefinedUser);
        }
    },
    today:function(f)
    {
        var callback;
        if (arguments.length == 0) {
            return moment().startOf('day').toDate();
        }
        else if (arguments.length == 1) {
            callback = arguments[0];
        }
        else {
            var timezone = arguments[0];
            callback = arguments[1];
        }
        callback(null,moment().startOf('day').toDate());
    },
    startOfMonth:function(callback)
    {
        callback(null,moment().startOf('month').toDate());
    },
    lastMonth:function(callback)
    {
        callback(null,moment().subtract(1, 'month').toDate());
    },
    lastWeek:function(callback)
    {
        callback(null, moment().subtract(7, 'day').toDate());
    },
    lastDay:function(callback)
    {
        callback(null, moment().subtract(1, 'day').toDate());
    },
    lastHour:function(callback)
    {
        callback(null, moment().subtract(1, 'day').toDate());
    },
    email: function(callback) {
        var self = this;
        callback(null, self.context.user.name);
    },
    person: function(callback) {
        var self = this;
        self.context.model('Person').where('user/name').equal(self.context.user.name).select('id').silent().value().then(function(result) {
            return callback(null, result);
        }).catch(function(err) {
            callback(err);
        })
    }
};

DataModel.prototype.resolveMethod = function(name, args, callback) {
    if (typeof resolver[name] === 'function') {
        var a = args || [];
        a.push(callback);
        resolver[name].apply(this, a);
    }
    else {
        //callback(new Error(util.format('The specified function (%s) cannot be resolved.', name)));
        callback();
    }
};

DataModel.prototype.initialize = function() {
    //
};