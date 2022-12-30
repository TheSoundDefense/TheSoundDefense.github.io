var app = angular.module('randomSettingsApp', []);
app.controller('randomSettingsCtrl', ['$http', randomSettingsCtrl]);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
