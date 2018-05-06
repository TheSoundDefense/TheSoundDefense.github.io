var app = angular.module('bingoApp', ['ngRoute']);
app.config(['$compileProvider', '$routeProvider', function($compileProvider, $routeProvider) {
  $compileProvider.debugInfoEnabled = false;
  $routeProvider.when('/board/:board', {
    templateUrl: 'index.html',
    controller: 'bingoCtrl'
  });
}]);
app.controller('bingoCtrl', ['$routeParams', bingoCtrl]);
