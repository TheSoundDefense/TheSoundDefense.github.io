var app = angular.module('comparatorApp', []);
app.controller('comparatorCtrl', comparatorCtrl);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
