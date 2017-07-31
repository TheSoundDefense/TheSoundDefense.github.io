var app = angular.module('numberBoardApp', []);
app.controller('numberBoardCtrl', numberBoardCtrl);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
