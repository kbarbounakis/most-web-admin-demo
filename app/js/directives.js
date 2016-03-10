/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */
/**
 * Place application directives here
 */


function PieChartDirective() {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var pieChartCanvas = angular.element(element).get(0).getContext("2d");
            var pieChart = new Chart(pieChartCanvas);

            var pieOptions = {
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke: true,
                //String - The colour of each segment stroke
                segmentStrokeColor: "#fff",
                //Number - The width of each segment stroke
                segmentStrokeWidth: 1,
                //Number - The percentage of the chart that we cut out of the middle
                percentageInnerCutout: 50, // This is 0 for Pie charts
                //Number - Amount of animation steps
                animationSteps: 100,
                //String - Animation easing effect
                animationEasing: "easeOutBounce",
                //Boolean - Whether we animate the rotation of the Doughnut
                animateRotate: true,
                //Boolean - Whether we animate scaling the Doughnut from the centre
                animateScale: false,
                //Boolean - whether to make the chart responsive to window resizing
                responsive: true,
                // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
                maintainAspectRatio: false,
                //String - A legend template
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
                //String - A tooltip template
                tooltipTemplate: "<%=value %> <%=label%> users"
            };

            scope.$watch(attrs.source, function(data) {
               if (data) {
                   //Create pie or douhnut chart
                   // You can switch between pie and douhnut using the method below.
                   pieChart.Doughnut(data, pieOptions);
               }
            });


        }
    };
}

function JsonDataDirective($http, $q) {
    return {
        restrict: 'E',
        scope: { src:'@', target: '@', single:'@', interval:'@'},
        replace: true,
        link: function (scope, element, attrs) {
            var deferred = $q.defer(), parentScope = scope.$parent;
            //set property to promise
            parentScope[scope.target] = deferred.promise;
            var options = {
                method: "GET",
                "Content-type": "application/json",
                url: scope.src,
                data: attrs
            };
            scope.load = function() {
                //execute HTTP request
                $http(options).then(function (response) {
                    if (/^true$/i.test(scope.single)) {
                        if (angular.isArray(response.data)) {
                            parentScope[scope.target] = response.data[0];
                            deferred.resolve(response.data[0]);
                            return;
                        }
                    }
                    parentScope[scope.target] = response.data;
                    //resolve data
                    //after load formatting
                    deferred.resolve(response.data);

                }, function (reason) {
                    parentScope[scope.target] = null;
                    //reject with error
                    console.log(reason);
                    deferred.reject('An internal server error occured.');
                });
            };
            //execute load
            scope.load();
            //watch reload event
            var reloadOn = attrs['on'];
            if (reloadOn) {
                parentScope.$on(reloadOn, function() {
                    //realod
                    scope.load();
                });
            }
            if (/\b\d+\b/g.test(scope.interval)) {
                var interval = parseInt(scope.interval);
                if (interval>=1000) {
                    setInterval(function() {
                        try {
                            scope.load();
                        }
                        catch(e) {
                            console.log(e);
                        }
                    }, interval);
                }
            }
        }
    }
}

angular.module('main.directives', [])
    .directive('pieChart', PieChartDirective)
    .directive('json', JsonDataDirective);