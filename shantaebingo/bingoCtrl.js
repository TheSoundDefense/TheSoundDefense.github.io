var bingoCtrl = function bingoCtrl($location, bingoList) {
  var self = this;

  // ****
  // INIT
  // ****

  self.cards = [
    ["","","","",""],
    ["","","","",""],
    ["","","","",""],
    ["","","","",""],
    ["","","","",""]
  ];
  self.board = $location.search().board;
  self.toggled = [
    [false,false,false,false,false],
    [false,false,false,false,false],
    [false,false,false,false,false],
    [false,false,false,false,false],
    [false,false,false,false,false]
  ];
  self.toggleGoal = function toggleGoal(i,j) {
    self.toggled[i][j] = !self.toggled[i][j];
  };

  // Here we generate an additional list and add indices to it, so we can
  // generate a board from a URL.
  var goalList = [];
  var goalIndex = 0;
  // We start from one, because that's the first index that has an actual list
  // of goals in the master bingoList.
  for (var i = 1; i < bingoList.length; i++) {
    var difficultyList = bingoList[i];
    for (var j = 0; j < difficultyList.length; j++) {
      var goal = difficultyList[j];
      goalList.push(goal.name);
      goal["index"] = goalIndex;
      goalIndex = goalIndex + 1;
    }
  }

  // **************************
  // BOARD GENERATION FUNCTIONS
  // **************************

  self.randInt = function randInt(ceiling) {
    return Math.floor(Math.random() * ceiling);
  };

  self.spliceRandomListElement = function spliceRandomListElement(list) {
    var randomIndex = self.randInt(list.length);
    return list.splice(randomIndex, 1)[0];
  };

  // The query parameter representing the board is basically a list of all 25
  // goals. Each goal is represented by its index in the goalList array,
  // converted to hex. This function converts each value back to decimal, looks
  // that value up in the goalList array, and assigns that string to the right
  // card.
  self.renderBoardFromUrl = function(boardString, goalList) {
    var currentString = boardString;
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        var currentGoal = currentString.slice(0,2);
        currentString = currentString.slice(2);

        var goalNum = parseInt("0x" + currentGoal, 16);
        self.cards[i][j] = goalList[goalNum];
      }
    }
  };

  // Types1 has already been checked to ensure it has at least one element, so
  // we can take it for granted here.
  self.checkTypes = function checkTypes(types1, types2) {
    for (var k = 0; k < types2.length; k++) {
      if (types1.includes(types2[k])) {
        return false;
      }
    }

    return true;
  };

  // Check the current row, column, and diagonals (if applicable) to ensure that
  // there are no conflicting types.
  self.validTypes = function validTypes(currentTypes, currentGoals, i, j) {
    if (currentTypes.length === 0) {
      return true;
    }

    // Row.
    var currentCol = j - 1;
    while (currentCol >= 0) {
      var checkGoal = currentGoals[i][currentCol];
      var checkTypes = checkGoal.types;

      if (!self.checkTypes(currentTypes, checkTypes)) {
        return false;
      }

      currentCol = currentCol - 1;
    }

    // Column.
    var currentRow = i - 1;
    while (currentRow >= 0) {
      var checkGoal = currentGoals[currentRow][j];
      var checkTypes = checkGoal.types;

      if (!self.checkTypes(currentTypes, checkTypes)) {
        return false;
      }

      currentRow = currentRow - 1;
    }

    // Diagonal 1.
    if (i === j) {
      var currentRow = i - 1;
      var currentCol = j - 1;
      while (currentRow >= 0 && currentCol >= 0) {
        var checkGoal = currentGoals[currentRow][currentCol];
        var checkTypes = checkGoal.types;

        if (!self.checkTypes(currentTypes, checkTypes)) {
          return false;
        }

        currentRow = currentRow - 1;
        currentCol = currentCol - 1;
      }
    }

    // Diagonal 2.
    if (i + j === 4) {
      var currentRow = i - 1;
      var currentCol = j + 1;
      while (currentRow >= 0 && currentCol <= 4) {
        var checkGoal = currentGoals[currentRow][currentCol];
        var checkTypes = checkGoal.types;

        if (!self.checkTypes(currentTypes, checkTypes)) {
          return false;
        }

        currentRow = currentRow - 1;
        currentCol = currentCol + 1;
      }
    }

    return true;
  };

  // Go through a list of goals for a given difficulty and find one that has no
  // type conflicts, if possible.
  self.getGoalFromList = function getGoalFromList(currentItems, goals, i, j) {
    var currentItemsCopy = JSON.parse(JSON.stringify(currentItems));
    while (currentItemsCopy.length > 0) {
      var tentativeGoal = self.spliceRandomListElement(currentItemsCopy);

      if (self.validTypes(tentativeGoal.types, goals, i, j)) {
        return tentativeGoal;
      }
    }

    return undefined;
  };

  // Generate a bingo card from scratch.
  self.generateBoard = function(fullGoalList) {
    var listsRemaining = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
    var goals = [
      [undefined,undefined,undefined,undefined,undefined],
      [undefined,undefined,undefined,undefined,undefined],
      [undefined,undefined,undefined,undefined,undefined],
      [undefined,undefined,undefined,undefined,undefined],
      [undefined,undefined,undefined,undefined,undefined]
    ];

    // Go row by row, assigning goals.
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 5; j++) {
        var suitableGoalFound = false;
        // It's possible that we will need to try again with another difficulty
        // level, as none of the goals for a given difficulty level will be
        // suitable. That's why we do a deep copy of the list, so we can
        // preserve it.
        var listsRemainingCopy = JSON.parse(JSON.stringify(listsRemaining));
        // I know JavaScript isn't that tightly scoped but I don't care, I'm
        // declaring this outside the loop.
        var currentListInd = -1;
        while (!suitableGoalFound && listsRemainingCopy.length > 0) {
          currentListInd = self.spliceRandomListElement(listsRemainingCopy);
          var currentGoalList = fullGoalList[currentListInd];

          var chosenGoal = self.getGoalFromList(currentGoalList, goals, i, j);
          if (chosenGoal !== undefined) {
            goals[i][j] = chosenGoal;
            suitableGoalFound = true;
            break;
          }
        }

        // If we never found a suitable goal, then we've completely failed and
        // have to start over from scratch.
        if (!suitableGoalFound) {
          console.log("Failed to create a board. Trying again.");
          self.generateBoard(fullGoalList);
          return;
        }

        // If we did find a suitable goal, pluck that difficulty from the list
        // so we don't try to grab it again.
        listsRemaining.splice(listsRemaining.indexOf(currentListInd), 1);
      }
    }

    // Now that we have a full board, we need to create a string representation
    // of it so that it can be shared.
    var newBoardString = "";
    for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        var currentGoalString = goals[i][j].index.toString(16);
        if (currentGoalString.length === 1) {
          currentGoalString = "0" + currentGoalString;
        }
        newBoardString += currentGoalString;
      }
    }
    self.board = newBoardString;

    // And now, actually place the goals onto the board.
    for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        self.cards[i][j] = goals[i][j].name;
      }
    }
  };

  // *******************
  // CHOOSE YOUR DESTINY
  // *******************
  if (self.board) {
    self.renderBoardFromUrl(self.board, goalList);
  } else {
    self.generateBoard(bingoList);
  }
};
