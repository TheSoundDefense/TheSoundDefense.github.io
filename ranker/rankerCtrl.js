var rankerCtrl = function rankerCtrl() {
  var self = this;

  self.displayedTab = 'list';
  self.listContents = '';
  self.itemList = [];

  // Do we truncate the list or rank the entire thing?
  self.truncate = "f";
  self.listLength = 10;

  // Are we re-sorting specific elements in a sorted list?
  self.resort = false;
  self.resortListContents = '';
  self.resortList = [];

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

  self.saveState = function saveState() {
    localStorage.setItem('truncate', self.truncate);
    localStorage.setItem('listLength', JSON.stringify(self.listLength));
    localStorage.setItem('firstList', JSON.stringify(self.firstList));
    localStorage.setItem('secondList', JSON.stringify(self.secondList));
    localStorage.setItem('mergedList', JSON.stringify(self.mergedList));
    localStorage.setItem('mergeIndex', JSON.stringify(self.mergeIndex));
    localStorage.setItem('fullMergeContents', JSON.stringify(self.fullMergeContents));
    localStorage.setItem('tempMergeContents', JSON.stringify(self.tempMergeContents));
    localStorage.setItem('resort', JSON.stringify(self.resort));
    localStorage.setItem('resortList', JSON.stringify(self.resortList));
  }

  self.restoreState = function restoreState() {
    if (localStorage.getItem('truncate') === null) {
      return;
    }

    self.truncate = localStorage.getItem('truncate');
    self.listLength = JSON.parse(localStorage.getItem('listLength'));

    self.firstList = JSON.parse(localStorage.getItem('firstList'));
    self.secondList = JSON.parse(localStorage.getItem('secondList'));
    self.mergedList = JSON.parse(localStorage.getItem('mergedList'));
    self.mergeIndex = JSON.parse(localStorage.getItem('mergeIndex'));

    self.fullMergeContents = JSON.parse(localStorage.getItem('fullMergeContents'));
    self.tempMergeContents = JSON.parse(localStorage.getItem('tempMergeContents'));

    self.resort = JSON.parse(localStorage.getItem('resort'));
    self.resortList = JSON.parse(localStorage.getItem('resortList'));

    self.displayedTab = 'sort';
    self.promptUser();
  }

  self.deleteState = function deleteState() {
    localStorage.clear();
  }

  self.mergeSort = function mergeSort() {
    var splitList = self.listContents.split('\n');
    for (var i = 0; i < splitList.length; i++) {
      if (splitList[i]) {
        self.itemList.push(splitList[i]);
      }
    }

    var splitResortList = self.resortListContents.split('\n');
    for (i = 0; i < splitResortList.length; i++) {
      if (splitResortList[i]) {
        self.resortList.push(splitResortList[i]);
        if (!self.itemList.includes(splitResortList[i])) {
          self.itemList.push(splitResortList[i]);
        }
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
    self.saveState();

    // If we're re-sorting, and neither of the current options are on
    // our re-sort list, just pick the first option to preseve the
    // existing sorting.
    if (self.resort) {
      if (!self.resortList.includes(self.firstItem)
      && !self.resortList.includes(self.secondItem)) {
        self.itemChosen(0);
      }
    }
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
    self.deleteState();
  };

  self.reset = function reset() {
    self.displayedTab = 'list';
    self.listContents = '';
    self.itemList = [];
    self.truncate = "f";
    self.listLength = 10;
    self.results = [];
    self.fullMergeContents = [];
    self.tempMergeContents = [];
    self.resort = false;
    self.resortList = [];
    self.mergeIndex = 0;
    self.firstList = [];
    self.secondList = [];
    self.firstItem = '';
    self.secondItem = '';
    self.mergedList = [];
    self.deleteState();
  };

  // If we have a stored state, restore it and restart the sort.
  self.restoreState();
};
