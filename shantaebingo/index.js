var app = angular.module('bingoApp', []);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
app.constant('bingoList', bingoList);
app.controller('bingoCtrl', ['$location', 'bingoList', bingoCtrl]);
