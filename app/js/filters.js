/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */
/**
 * Place application filters here
 */
angular.module('main.filters', []).filter('moment', function() {
    return function(input, format) {
        if (typeof input !== 'undefined' && input != null)
            return moment(input).format(format);
        return '';
    };
}).filter('total', function () {
    return function (input, property) {
        var i = input instanceof Array ? input.length : 0;
// if property is not defined, returns length of array
// if array has zero length or if it is not an array, return zero
        if (typeof property === 'undefined' || i === 0) {
            return i;
// test if property is number so it can be counted
        } else if (isNaN(input[0][property])) {
            throw 'filter total can count only numeric values';
// finaly, do the counting and return total
        } else {
            var total = 0;
            while (i--)
                total += input[i][property];
            return total;
        }
    };
});
