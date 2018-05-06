var app = angular.module('bingoApp', []);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
app.controller('bingoCtrl', ['$location', bingoCtrl]);
