var app = angular.module('comparatorApp', []);
app.controller('comparatorCtrl', ['$http', comparatorCtrl]);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
