
var HttpDataController = require('most-web').controllers.HttpDataController,
    HttpCsvResult = require('most-web-csv').HttpCsvResult;

HttpDataController.prototype.csv = function(data) {
    return new HttpCsvResult(data);
};
