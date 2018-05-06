var bingoCtrl = function bingoCtrl($routeParams) {
  var self = this;

  self.cards = [[1,2,3,4,5],[6,7,8,9,0],[1,2,3,4,5],[6,7,8,9,0],[1,2,3,4,5]];
  console.log($routeParams);
  self.board = $routeParams.board;
};
