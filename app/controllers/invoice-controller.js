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
function InvoiceController() {
    InvoiceController.super_.call(this);
}
util.inherits(InvoiceController, web.controllers.HttpBaseController);

InvoiceController.prototype.print = function (callback) {

    var self = this, context = self.context;
    context.handle("GET", function() {
        //get order
        context.model("Order").where("id").equal(context.params.id).first().then(function(order) {
            if (web.common.isNullOrUndefined(order)) {
                return callback(new web.common.HttpNotFoundException());
            }
            //get customer (with all data)
            context.model("Person").where("id").equal(order.customer).expand("address").first().then(function(customer) {
                order.customer = customer;
                var mailer = require("most-web-mailer");
                mailer.getMailer(context).template("invoice").test(true).send(order, function(err,result) {
                    if (err) {
                        web.common.log(err);
                        return callback(new web.common.HttpServerError());
                    }
                   //generate pdf
                    var pdf = require('html-pdf'),
                        options = { format: 'A4',"border": {
                            "top": "0.5in",
                            "right": "0.5in",
                            "bottom": "0.5in",
                            "left": "0.5in"
                        }};
                    pdf.create(result.html, options).toBuffer(function(err, buffer) {
                        if (err) {
                            web.common.log(err);
                            return callback(new web.common.HttpServerError());
                        }
                        var result = new web.mvc.HttpResult();
                        result.data = buffer;
                        result.contentType = "application/pdf";
                        result.contentEncoding = "binary";
                        //console.log('This is a buffer:', Buffer.isBuffer(buffer));
                        return callback(null, result);
                    });
                });
            }).catch(function(err) {
                web.common.log(err);
                return callback(new web.common.HttpServerError());
            });
        }).catch(function(err) {
            web.common.log(err);
            return callback(new web.common.HttpServerError());
        });
    }).unhandle(function() {
        return callback(new web.common.HttpBadRequest());
    });

};

if (typeof module !== 'undefined') module.exports = InvoiceController;