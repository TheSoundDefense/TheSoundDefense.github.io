var app = angular.module('randomSettingsApp', []);
app.controller('randomSettingsCtrl', ['$scope', '$http', randomSettingsCtrl]);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
