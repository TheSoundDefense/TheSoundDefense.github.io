var app = angular.module('rankerApp', []);
app.controller('rankerCtrl', rankerCtrl);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
