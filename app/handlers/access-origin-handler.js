
function AccessOriginHandler() {

}

AccessOriginHandler.prototype.beginRequest =  function(context, callback) {
    if (context.request.headers.origin) {
        //context.response.setHeader("Access-Control-Allow-Origin", "*");
        context.response.setHeader("Access-Control-Allow-Origin", context.request.headers.origin);
        context.response.setHeader("Access-Control-Allow-Credentials", "true");
        context.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Language, Accept, Accept-Language, Authorization");
        context.response.setHeader('Access-Control-Allow-Methods', "GET, OPTIONS, PUT, POST, DELETE");
    }
    return callback();
};

AccessOriginHandler.createInstance = function() {
    return new AccessOriginHandler();
};

if (typeof exports !== 'undefined') {
    module.exports.createInstance = AccessOriginHandler.createInstance;
    module.exports.RestrictHandler = AccessOriginHandler;
}