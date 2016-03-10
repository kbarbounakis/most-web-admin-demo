var HttpContext = require('most-web').HttpContext,
    HttpViewContext = require('most-web').views.HttpViewContext,
    HttpViewContext = require('most-web').views.HttpViewContext
    util = require('util'),
    moment = require('moment'),
        numeral = require('numeral');
/**
 * @type {moment.MomentStatic}
 */
HttpViewContext.prototype.init = function () {
    var self = this;
    util._extend(self.html, {
        moment:moment,
        numeral:numeral
    });

};




