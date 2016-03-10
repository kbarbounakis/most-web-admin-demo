/**
 * Created by kbarbounakis on 3/10/16.
 */
var FunctionContext = require('most-data').classes.FunctionContext,
    async = require("async"),
    Q = require("q"),
    moment = require('moment');


function int_(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

FunctionContext.prototype.newOrderNumber = function() {
    var self = this, deferred = Q.defer();
    process.nextTick(function() {
        try {
            var ord = ['ORD', 'DEF', 'STA', 'OFV', 'CAT', 'ZED', 'BIK'];
            deferred.resolve(ord[int_(1, ord.length) - 1] + int_(1000, 9999));
        }
        catch (err) {
            deferred.reject(err);
        }
    });
    return deferred.promise;
}