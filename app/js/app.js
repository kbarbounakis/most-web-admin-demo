/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */
var app = angular.module('main',['ngMessages','ui.router', 'ui.bootstrap','most','main.directives','main.controllers','main.filters']);
//
app.config(['$httpProvider', function($httpProvider) {
   $httpProvider.defaults.withCredentials = true;
}]);

app.config(['$svcProvider', function($svcProvider) {
    $svcProvider.defaults.base = "/";
}]);

app.config(['$contextProvider', function($contextProvider) {
    $contextProvider.defaults.base = "/";
}]);

/**
 * ui-router
 */
app.config(function($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/app");
    //
    // Now set up the states
    $stateProvider
        .state('app', {
            url: "/app",
            templateUrl: "/app.html"
        }).state('order', {
        url: "/order",
        templateUrl: "/examples/order_new.html"
    }).state('services', {
        url: "/services",
        templateUrl: "/examples/services.html"
    }).state('blank', {
        url: "/blank",
        templateUrl: "/examples/blank.html"
    }).state('invoice', {
        url: "/invoice/:id",
        templateUrl: "/examples/invoice.html"
    }).state('error', {
        url: "/error/:code",
        templateUrl: function (stateParams){
            return '/examples/' + stateParams.code + '.html';
        }
    });
});

//socket.io
app.provider("$socket", function SocketProvider() {
    this.defaults = { server:"http://127.0.0.1:8200/" };
    this.$get = function () {
        var self = this;
        return {
            register:function(nsp) {
                nsp = nsp || "/";
                return io(self.defaults.server.replace(/\/$/,"") + nsp);
            }
        };
    };
});