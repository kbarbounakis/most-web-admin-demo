/**
 * MOST Web Framework Model Class for Person
 * Created by kbarbounakis on 2015-12-01.
 */
var util = require('util'), dat = require('most-data'), web = require('most-web');
/**
 * @class PersonModel
 * @param {*} obj
 * @constructor
 * @augments DataObject
 */
function PersonModel(obj) {
    PersonModel.super_.call(this, 'Person', obj);
}
util.inherits(PersonModel, dat.DataObject);

PersonModel.prototype.test = function (callback) {
    var self = this, context = self.context;
    try {
        callback();
    }
    catch (e) {
        callback(e);
    }
};

if (typeof module !== 'undefined') module.exports = PersonModel;