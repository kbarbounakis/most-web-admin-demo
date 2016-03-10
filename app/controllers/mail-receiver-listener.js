/**
 * MOST Web Framework Model Listener
 * Created by kbarbounakis on 2015-11-22.
 */
var web = require('most-web'), util = require('util'), async = require('async');

/**
 * @param {DataEventArgs} event
 * @param {function(Error=)} callback
 */
exports.afterSave = function (event, callback) {
    try {
        var context = event.model.context;
        if (event.state !== 1) { return callback(); }
        if (event.target.$receiving) { return callback(); }
        //update other mailboxes (to,cc,bcc)
        var arr = [];
        if (event.target.recipient) {
            event.target.recipient.split(';').forEach(function(x) {
                if (x.length>0) {
                    if (arr.indexOf(x)<0) { arr.push(x); }
                }
            });
        }
        if (event.target.cc) {
            event.target.cc.split(';').forEach(function(x) {
                if (x.length>0) {
                    if (arr.indexOf(x)<0) { arr.push(x); }
                }
            });
        }
        if (event.target.bcc) {
            event.target.bcc.split(';').forEach(function(x) {
                if (x.length>0) {
                    if (arr.indexOf(x)<0) { arr.push(x); }
                }
            });
        }
        context.model('Person').where('email').in(arr).select('user').asArray().flatten().silent().all(function(err, result) {
            if (err)  { return callback(err); }
            var arr = [];
            for (var i = 0; i < result.length; i++) {
                var m1 = util._extend({}, event.target);
                //remove id
                delete m1.id;
                //remove bcc
                delete m1.bcc;
                //set owner
                m1.owner = result[i];
                //set receiving flag
                m1.$receiving = true;
                //add message
                arr.push(m1);
            }
            if (arr.length==0) { return callback(); }
            event.model.silent().save(arr, function(err) {
                if (err) { web.common.log(err); }
                callback();
            });
        });
    }
    catch (e) {
        callback(e);
    }
};