var numberBoardCtrl = function numberBoardCtrl() {
  var self = this;

  self.on = [];
  for (var j = 0; j < 2500; j++) {
    self.on[j] = true;
  }

  self.range = function range(min, max) {
    var input = [];
    for (var i = min; i <= max; i++) {
      input.push(i);
    }

    return input;
  }

  self.toggle = function toggle(n) {
    self.on[n] = !self.on[n];
  }
};
