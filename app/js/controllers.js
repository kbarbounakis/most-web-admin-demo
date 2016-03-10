/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */
/**
 * Place application controllers here
 */
angular.module('main.controllers', [ 'most' ]).controller('PersonController', function($scope, $svc) {
    CommonController($scope);
    var q = new ClientDataQueryable('Person', $svc);
    q.where('email').equal('alexis.rees@example.com').data().then(function(result) {
       $scope.item = result[0]; 
    }).catch(function(err) {
        alert(err);
    });
    
    $scope.save = function() {
        $svc.save($scope.item, { model:'Person' }, function(err) {
           if (err) { return alert(err); } 
           $scope.reload();
        });
    }
    
}).controller('ChatController', function($scope, $socket) {
    var vm = this;
    function activate() {
        var nsp = $socket.register("/chat");

        vm.send = function() {
            nsp.emit("add", {
                commentText:vm.commentText
            });
            vm.commentText = "";
        };

        nsp.on("new", function(data) {
            $scope.$apply(function() {
                vm.comments.unshift(data);
            });
        });
    }
    activate();
}).controller('OrderController', function($scope, $context, $state) {
    var vm = this;
    function activate() {

        vm.getProducts = function(query) {
            return $context.model("Product").where("name").indexOf(query).greaterOrEqual(0)
                .or("model").indexOf(query).greaterOrEqual(0)
                .take(10)
                .orderBy("name")
                .getItems().then(function(result) {
                    return result;
            }).catch(function(err) {
                console.log(err);
            })
        }
        vm.getCustomers = function(query) {
            return $context.model("Person").where("description").indexOf(query).greaterOrEqual(0)
                .or("familyName").indexOf(query).greaterOrEqual(0)
                .or("givenName").indexOf(query).greaterOrEqual(0)
                .take(10)
                .expand("address")
                .orderBy("description")
                .getItems().then(function(result) {
                    return result;
                }).catch(function(err) {
                    console.log(err);
                })
        };

        vm.save = function() {
            try {
                $context.model("Order").save(vm.item).then(function(result) {
                    $state.go("invoice", { id:result.id });
                }).catch(function(err) {
                    console.log(err);
                })
            }
            catch(err) {
                console.log(err);
            }
        };

        //set default options for item
        if (!angular.isDefined(vm.item)) {
            vm.item = { paymentDue : moment(new Date()).subtract(-2,'days').toDate() };
        }

    }
    activate();
}).controller("ServiceExampleController", function($scope,$http) {
    var vm = this;
    function activate() {
        vm.get = function(u) {
            $http.get(u).then(function(result) {
                vm.result = result.data;
            }).catch(function(err) {
                vm.result = err;
            })
        };

        $scope.$watch('service', function(value) {
           if (value) {
               vm.get(value.url);
           }
        });

        vm.services = [
            {
                "description":"Get a list of products with category equal to Laptops",
                "url":"/Product/index.json?$filter=category eq 'Laptops'&$order=name&$top=10"
            },
            {
                "description":"Get a list of products with category equal to Laptops and price lower than 500",
                "url":"/Product/index.json?$filter=category eq 'Laptops' and price lt 500&$order=price&$top=10"
            },
            {
                "description":"Get total products per category",
                "url":"/Product/index.json?$group=category&$select=count(id) as total,category&$order=count(id) desc"
            },
            {
                "description":"Get a list of products where name starts with 'Apple'",
                "url":"/Product/index.json?$filter=startswith(name,'Apple') eq true"
            },
            {
                "description":"Get a list of products where name contains word 'MacBook'",
                "url":"/Product/index.json?$filter=contains(name,'MacBook') eq true"
            },
            {
                "description":"Get a list of orders where order date is equal to 20-Mar 2015",
                "url":"/Order/index.json?$filter=date(orderDate) eq '2015-03-20'"
            },
            {
                "description":"Get a list of orders where status is Processing (with total count)",
                "url":"/Order/index.json?$filter=orderStatus/alternateName eq 'OrderProcessing'&$inlinecount=true&$top=10&$order=orderDate"
            },
            {
                "description":"Get a list of orders and expand customer data",
                "url":"/Order/index.json?$top=10&$expand=customer"
            },
            {
                "description":"Get a list of orders and select specific attributes",
                "url":"/Order/index.json?$select=id,customer,orderStatus&$top=10"
            },
            {
                "description":"Get a list of orders and select specific attributes with alias",
                "url":"/Order/index.json?$select=id,customer/description as customerName,orderStatus/name as orderStatusName"
            },
            {
                "description":"Get total orders count per order status",
                "url":"/Order/index.json?$select=count(id) as totalCount,orderStatus&$group=orderStatus"
            },
            {
                "description":"Get product with the highest price",
                "url":"/Product/index.json?$select=id,name,model,price&$first=true&$filter=category eq 'Laptops'&$order=price desc"
            },
            {
                "description":"Get orders with status in transit where customer lives in Edinburgh",
                "url":"/Order/index.json?$expand=customer&$filter=orderStatus/alternateName eq 'OrderInTransit' and customer/address/addressLocality eq 'Edinburgh'"
            }
        ];

    }
    activate();
});
