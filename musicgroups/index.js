var app = angular.module('musicGroupsApp', []);
app.controller('musicGroupsCtrl', ['$http', musicGroupsCtrl]);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
