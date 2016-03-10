/**
 * MOST Web Framework Model Listener
 * Created by kbarbounakis on 2015-11-22.
 */
var web = require('most-web'), util = require('util');

/**
 * @param {DataEventArgs} event
 * @param {function(Error=)} callback
 */
exports.beforeSave = function (event, callback) {
    try {
        var context = event.model.context;
        if (web.common.isNullOrUndefined(event.target.address)) {
            return callback();
        }
        if (event.state==1) {
            //save address for this person
            context.model('PostalAddress').silent().save(event.target.address, function(err) {
                callback(err);
            });
        }
        else if (event.state == 2) {
            //first of all get original address from db
            event.model.where('id').equal(event.target.id).select(['id','address']).expand('address').silent().first(function(err, result) {
                if (err) { return callback(err); }
                if (web.common.isNullOrUndefined(result)) { return callback(new Error('Invalid object state.')); }
                if (web.common.isNullOrUndefined(result.address)) {
                    context.model('PostalAddress').silent().save(event.target.address, function(err) {
                       callback(err);
                    });
                }
                else {
                    //first of all delete address id from target
                    delete event.target.address.id;
                    //extend original address
                    util._extend(result.address, event.target.address);
                    //save data
                    context.model('PostalAddress').silent().save(result.address, function(err) {
                        if (err) { return callback(err); }
                        //set saved address to target
                        event.target.address = result.address;
                        callback();
                    });
                }
            });
        }
        else {
            return callback();
        }
    }
    catch (e) {
        callback(e)
    }
};

/**
 * @param {DataEventArgs} event
 * @param {function(Error=)} callback
 */
exports.beforeRemove = function (event, callback) {
    try {
        var context = event.model.context;
        if (event.state !== 4) { return callback(); }
        event.model.where('id').equal(event.target.id).select(['id','address']).flatten().silent().first(function(err, result) {
            if (err) { return callback(err); }
            if (web.common.isNullOrUndefined(result)) { return callback(); }
            if (web.common.isNullOrUndefined(result.address)) { return callback(); }
            context.model('PostalAddress').remove({id:result.address}, function(err) {
               return callback(err);
            });
        });
    }
    catch (e) {
        callback(e)
    }
};