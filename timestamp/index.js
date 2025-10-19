var app = angular.module('discordTimestampApp', []);
app.controller('discordTimestampCtrl', ['$http', discordTimestampCtrl]);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
