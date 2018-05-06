var app = angular.module('bingoApp', []);
app.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled = false;
}]);
app.constant('goalDifficultyList', goalDifficultyList);
app.constant('goalList', goalList);
app.controller('bingoCtrl', ['$location', 'goalDifficultyList', 'goalList', bingoCtrl]);
