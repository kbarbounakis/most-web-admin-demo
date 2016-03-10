/**
 * MOST Web Framework application server initialization
 */
var web = require('most-web');
//start application
web.current.start({
    port: process.env.PORT ? process.env.PORT: 3000,
    ip:process.env.IP || '0.0.0.0',
    cluster: process.env.NODE_CLUSTER
});
//initialize io server
var io = require('socket.io')(web.current.getServer());
//register application service
web.current.service("io",function() {
   return io;
});

var chat = io.of("/chat");

chat.on('add', function(message) {
    web.current.unattended(function(context) {
        var id = lorem.int(260,300);
        context.model("User").where("name").equal(message.name).silent().select("description","image").first().then(function(result) {
            if (web.common.isNullOrUndefined(result)) { return; }
            chat.emit('new', {
                commentBy:result,
                commentTime:new Date(),
                commentText:lorem.generate(4,7,1,3)
            });
        });
    });
});

//random chat
var lorem = require("./lib/lorem");
/*
setInterval(function() {
    web.current.unattended(function(context) {
        var id = lorem.int(260,300);
        context.model("User").where("id").equal(id).silent().select("description","image").first().then(function(result) {
            if (web.common.isNullOrUndefined(result)) { return; }
            chat.emit('new', {
                commentBy:result,
                commentTime:new Date(),
                commentText:lorem.generate(4,7,1,3)
            });
        });
    });
},30000);
*/





