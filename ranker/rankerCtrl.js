var rankerCtrl = function rankerCtrl() {
  var self = this;

  self.displayedTab = 'list';
  self.listContents = '';
  self.itemList = [];

  // Do we truncate the list or rank the entire thing?
  self.truncate = "f";
  self.listLength = 10;

  // The final displayed list.
  self.results = [];

  // The current state of all the merging.
  self.fullMergeContents = [];
  // The list of lists we'll be adding newly merged lists into.
  self.tempMergeContents = [];

  // Information for the current step.
  self.mergeIndex = 0;
  self.firstList = [];
  self.secondList = [];
  self.firstItem = '';
  self.secondItem = '';
  self.mergedList = [];

  self.mergeSort = function mergeSort() {
    var splitList = self.listContents.split('\n');
    for (var i = 0; i < splitList.length; i++) {
      if (splitList[i]) {
        self.itemList.push(splitList[i]);
      }
    }

    if (self.itemList.length == 1) {
      self.results = [self.itemList[0]];
      self.displayedTab = 'results';
    } else if (self.itemList.length > 1) {
      self.displayedTab = 'sort';
      self.initMerge();
    }
  };

  self.initMerge = function initMerge() {
    for (var i = 0; i < self.itemList.length; i++) {
      self.fullMergeContents.push([self.itemList[i]]);
    }

    self.displayedTab = 'sort';
    self.startMergeRound();
  };

  self.startMergeRound = function startMergeRound() {
    self.mergeIndex = 0;
    self.firstList = self.fullMergeContents[0];
    self.secondList = self.fullMergeContents[1];

    self.promptUser();
  };

  self.promptUser = function promptUser() {
    self.firstItem = self.firstList[0];
    self.secondItem = self.secondList[0];
  };

  self.itemChosen = function itemChosen(index) {
    if (index == 0) {
      self.mergedList.push(self.firstList.shift());
    } else {
      self.mergedList.push(self.secondList.shift());
    }

    if (self.truncate == 't' && self.mergedList.length >= self.listLength) {
      self.pushMergedList();
    } else if (self.firstList.length == 0) {
      self.mergedList = self.mergedList.concat(self.secondList);
      self.pushMergedList();
    } else if (self.secondList.length == 0) {
      self.mergedList = self.mergedList.concat(self.firstList);
      self.pushMergedList();
    } else {
      self.promptUser();
    }
  };

  self.pushMergedList = function pushMergedList() {
    self.tempMergeContents.push(self.mergedList);
    self.mergedList = [];
    self.nextLists();
  };

  self.nextLists = function nextLists() {
    self.mergeIndex += 2;
    if (self.mergeIndex == self.fullMergeContents.length) {
      self.nextRound();
    } else if (self.mergeIndex + 1 == self.fullMergeContents.length) {
      self.tempMergeContents.push(self.fullMergeContents[self.mergeIndex]);
      self.nextRound();
    } else {
      self.firstList = self.fullMergeContents[self.mergeIndex];
      self.secondList = self.fullMergeContents[self.mergeIndex+1];
      self.promptUser();
    }
  };

  self.nextRound = function nextRound() {
    self.fullMergeContents = self.tempMergeContents;
    self.tempMergeContents = [];

    if (self.fullMergeContents.length == 1) {
      self.displayResults();
    } else {
      self.startMergeRound();
    }
  };

  self.displayResults = function displayResults() {
    self.results = self.fullMergeContents[0];
    self.displayedTab = 'results';
  };
};
