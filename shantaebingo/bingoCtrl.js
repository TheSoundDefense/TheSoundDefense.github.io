var bingoCtrl = function bingoCtrl($location) {
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

  // ****************
  // LIST DEFINITIONS
  // ****************

  self.bingoList = [];
  self.bingoList[0] = [
    {name: "No shopping", types: ["Shop"], index: 0},
    {name: "90% completion", types: ["Percent"], index: 1},
    {name: "20 Dark Magic", types: ["Dark_Magic"], index: 2},
    {name: "80% completion", types: ["Percent"], index: 3},
    {name: "70% completion", types: ["Percent"], index: 4}
  ];
  self.bingoList[1] = [
    {name: "16 Dark Magic", types: ["Dark_Magic"], index: 5},
    {name: "Exit through the exit (Drizzle Fountain)", types: [], index: 6},
    {name: "(Super) Pike Ball damage only (Dagron)", types: ["Boss_Restriction","Dagron_Restriction"], index: 7},
    {name: "7 hearts", types: ["Hearts"], index: 8},
    {name: "3 Pirate Master trials", types: ["Trials"], index: 9},
    {name: "700 gems", types: ["Gem_Count"], index: 10}
  ];
  self.bingoList[2] = [
    {name: "6 hearts", types: ["Hearts"], index: 11},
    {name: "12 Dark Magic", types: ["Dark_Magic"], index: 12},
    {name: "Heal 15 full hearts in the bath house", types: ["Heal_Hearts"], index: 13},
    {name: "600 gems", types: ["Gem_Count"], index: 14},
    {name: "2 Pirate Master trials", types: ["Trials"], index: 15},
    {name: "Go to court", types: [], index: 16}
  ];
  self.bingoList[3] = [
    {name: "Complete 7 gauntlets", types: ["Gauntlets"], index: 17},
    {name: "Secret sewer gauntlet", types: ["Gauntlets"], index: 18},
    {name: "2 trades with the Mayor", types: ["Mayor_Trade"], index: 19},
    {name: "Keep Library Card", types: ["Keep_Item"], index: 20},
    {name: "(Super) Pike Ball damage only (Steel Maggot)", types: ["Boss_Restriction","Maggot_Restriction"], index: 21},
    {name: "Heal 10 full hearts in the bath house", types: ["Heal_Hearts"], index: 22}
  ];
  self.bingoList[4] = [
    {name: "(Super) Pike Ball damage only (Pirate Master)", types: ["Boss_Restriction","Master_Restriction"], index: 23},
    {name: "Complete 3 gauntlets (Cackle tower)", types: ["Gauntlets"], index: 24},
    {name: "1 Pirate Master trial", types: ["Trials"], index: 25},
    {name: "Kill 5 bosses without advance Risky items", types: ["Boss_Restriction","Risky_Item"], index: 26},
    {name: "Get 3 keys (Tan Line Temple)", types: ["Get_Keys"], index: 27},
    {name: "Complete 6 gauntlets", types: ["Gauntlets"], index: 28}
  ];
  self.bingoList[5] = [
    {name: "Kill 3 bosses with no powerups", types: ["Boss_Restriction","No_Powerups"], index: 29},
    {name: "Start the fan (Cackle Tower)", types: [], index: 30},
    {name: "No Drizzle Fountain (Spittle Maze)", types: ["Restriction"], index: 31},
    {name: "No Risky Shuffle (Oubliette of Suffering)", types: ["Move_Restriction"], index: 32},
    {name: "No Pirate Flares (Mud Bog Island)", types: ["Item_Restriction"], index: 33},
    {name: "Learn Power Kick", types: ["Learn_Move"], index: 34}
  ];
  self.bingoList[6] = [
    {name: "8 Dark Magic", types: ["Dark_Magic"], index: 35},
    {name: "5 hearts", types: ["Hearts"], index: 36},
    {name: "500 gems", types: ["Gem_Count"], index: 37},
    {name: "(Super) Pike Ball damage only (Cyclops Plant)", types: ["Boss_Restriction","Cyclops_Restriction"], index: 38},
    {name: "(Super) Pike Ball damage only (Empress Spider)", types: ["Boss_Restriction","Spider_Restriction"], index: 39},
    {name: "Complete 5 gauntlets", types: ["Gauntlets"], index: 40}
  ];
  self.bingoList[7] = [
    {name: "Get 5 keys (Abandoned Factory)", types: ["Get_Keys"], index: 41},
    {name: "(Super) Pike Ball damage only (Squid Baron)", types: ["Boss_Restriction","Squid_Restriction"], index: 42},
    {name: "400 gems", types: ["Gem_Count"], index: 43},
    {name: "Get 2 keys (Tan Line Temple)", types: ["Get_Keys"], index: 44},
    {name: "4 Cacklebats (Scuttle Town)", types: ["Cacklebats"], index: 45}
  ];
  self.bingoList[8] = [
    {name: "Kill 10 Nagas (Village of Lost Souls)", types: ["Kill_Quest"], index: 46},
    {name: "12 distinct save men", types: ["Save_Man"], index: 47},
    {name: "Get 3 keys (Lost Catacombs)", types: ["Get_Keys"], index: 48},
    {name: "Second-level hair upgrades", types: ["Upgrade"], index: 49},
    {name: "No Risky Shuffle (Propeller Town)", types: ["Move_Restriction"], index: 50},
    {name: "No Risky Shuffle (Village of Lost Souls)", types: ["Move_Restriction"], index: 51}
  ];
  self.bingoList[9] = [
    {name: "1 Heart Squid (Tan Line Temple)", types: ["Heart_Squid"], index: 52},
    {name: "No Pirate Flares (Spiderweb Island)", types: ["Item_Restriction"], index: 53},
    {name: "No Pirate Flares (Tan Line Island)", types: ["Item_Restriction"], index: 54},
    {name: "Unlock the ground floor (Lost Catacombs)", types: [], index: 55},
    {name: "Complete 4 gauntlets", types: ["Gauntlets"], index: 56},
    {name: "Kill 2 bosses with no upgrades", types: ["Boss_Restriction","No_Powerups"], index: 57}
  ];
  self.bingoList[10] = [
    {name: "Kill 4 bosses without advance Risky items", types: ["Boss_Restriction","Risky_Item"], index: 58},
    {name: "No Bubble Shield (Pirate Master)", types: ["Item_Restriction","Master_Restriction"], index: 59},
    {name: "Complete 2 gauntlets (Oubliette of Suffering)", types: ["Gauntlets"], index: 60},
    {name: "4 Dark Magic", types: ["Dark_Magic"], index: 61},
    {name: "3 Heart Squids (Frostbite Island)", types: ["Heart_Squid"], index: 62}
  ];
  self.bingoList[11] = [
    {name: "1 trade with the Mayor", types: ["Mayor_Trade"], index: 63},
    {name: "No Pirate Flares (Frostbite Island)", types: ["Item_Restriction"], index: 64},
    {name: "Step on five conveyor belts (Abandoned Factory)", types: [], index: 65},
    {name: "Get 2 keys (Oubliette of Suffering)", types: ["Get_Keys"], index: 66},
    {name: "2 Heart Squids (Oubliette of Suffering)", types: ["Heart_Squid"], index: 67},
    {name: "Get 4 keys (Abandoned Factory)", types: ["Get_Keys"], index: 68}
  ];
  self.bingoList[12] = [
    {name: "No Pirate Flares (Saliva Island)", types: ["Item_Restriction"], index: 69},
    {name: "No Super Pike Ball (Empress Spider)", types: ["Boss_Restriction","Spider_Restriction"], index: 70},
    {name: "Pirate Flare out (Lonely Grave)", types: [], index: 71},
    {name: "Heal 5 full hearts in the bath house", types: ["Heal_Hearts"], index: 72},
    {name: "Scimitar Polish", types: ["Upgrade"], index: 73}
  ];
  self.bingoList[13] = [
    {name: "Kill 10 archers (Village of Lost Souls)", types: ["Kill_Quest"], index: 74},
    {name: "Kill 7 Scorpion Girls (Tan Line Island)", types: ["Kill_Quest"], index: 75},
    {name: "Keep Death Mask", types: ["Keep_Item"], index: 76},
    {name: "Kill 10 muck enemies (Mud Bog Island)", types: ["Kill_Quest"], index: 77},
    {name: "No hair whips (Squid Baron)", types: ["Boss_Restriction","Squid_Restriction"], index: 78}
  ];
  self.bingoList[14] = [
    {name: "No Risky's Scimitar (Cyclops Plant)", types: ["Boss_Restriction","Cyclops_Restriction"], index: 79},
    {name: "8 distinct save men", types: ["Save_Man"], index: 80},
    {name: "Learn Recover", types: ["Upgrade"], index: 81},
    {name: "2 Cacklebats (Tan Line Island)", types: ["Cacklebats"], index: 82},
    {name: "2 Cacklebats (Mud Bog Island)", types: ["Cacklebats"], index: 83},
    {name: "3 Cacklebats (Scuttle Town)", types: ["Cacklebats"], index: 84}
  ];
  self.bingoList[15] = [
    {name: "Complete 2 gauntlets (Cackle Tower)", types: ["Gauntlets"], index: 85},
    {name: "Get 2 keys (Lost Catacombs)", types: ["Get_Keys"], index: 86},
    {name: "Get 3 keys (Cackle Tower)", types: ["Get_Keys"], index: 87},
    {name: "No Risky's Cannon (Dagron)", types: ["Boss_Restriction","Dagron_Restriction"], index: 88},
    {name: "2 Heart Squids (Cackle Tower)", types: ["Heart_Squid"], index: 89},
    {name: "No Pirate Flares (Scuttle Town)", types: ["Item_Restriction"], index: 90}
  ];
  self.bingoList[16] = [
    {name: "Kill 5 Scorpion Girls (Tan Line Island)", types: ["Kill_Quest"], index: 91},
    {name: "Learn Backdash", types: ["Upgrade"], index: 92},
    {name: "1 Pistol Tune-Up", types: ["Upgrade"], index: 93},
    {name: "2 Cacklebats (Frostbite Island)", types: ["Cacklebats"], index: 94},
    {name: "Kill 6 Mermaids (Saliva Island)", types: ["Kill_Quest"], index: 95}
  ];
  self.bingoList[17] = [
    {name: "Kill 15 skeletons (Cackle Tower)", types: ["Kill_Quest"], index: 96},
    {name: "Kill 20 zombie bodies (Spiderweb Island)", types: ["Kill_Quest"], index: 97},
    {name: "First-level hair upgrades", types: ["Upgrade"], index: 98},
    {name: "Complete 1 gauntlet (Oubliette of Suffering)", types: ["Gauntlets"], index: 99},
    {name: "3 Heart Squids (Mud Bog Island)", types: ["Heart_Squid"], index: 100}
  ];
  self.bingoList[18] = [
    {name: "Kill 15 wolves (Frostbite Island)", types: ["Kill_Quest"], index: 101},
    {name: "Map (Abandoned Factory)", types: ["Map"], index: 102},
    {name: "Enter every normal room (Ye Royal Sewers)", types: [], index: 103},
    {name: "No Risky Shuffle (Lost Catacombs)", types: ["Move_Restriction"], index: 104},
    {name: "No Risky Shuffle (Mud Bog Island)", types: ["Move_Restriction"], index: 105},
    {name: "No Risky Shuffle (Abandoned Factory)", types: ["Move_Restriction"], index: 106}
  ];
  self.bingoList[19] = [
    {name: "No crouching (Steel Maggot)", types: ["Boss_Restriction","Maggot_Restriction"], index: 107},
    {name: "No Risky Shuffle (Cackle Tower)", types: ["Move_Restriction"], index: 108},
    {name: "2 Cacklebats (Saliva Island)", types: ["Cacklebats"], index: 109},
    {name: "4 Heart Squids (Scuttle Town)", types: ["Heart_Squid"], index: 110},
    {name: "5 distinct save men", types: ["Save_Man"], index: 111}
  ];
  self.bingoList[20] = [
    {name: "Complete 2 gauntlets (Spittle Maze)", types: ["Gauntlets"], index: 112},
    {name: "3 Heart Squids (Scuttle Town)", types: ["Heart_Squid"], index: 113},
    {name: "Map (Lost Catacombs)", types: ["Map"], index: 114},
    {name: "Get 1 key (Oubliette of Suffering)", types: ["Get_Keys"], index: 115},
    {name: "1 Cacklebat (Tan Line Island)", types: ["Cacklebats"], index: 116},
    {name: "2 Cacklebats (Spiderweb Island)", types: ["Cacklebats"], index: 117}
  ];
  self.bingoList[21] = [
    {name: "Kill 9 guards (Scuttle Town)", types: ["Kill_Quest"], index: 118},
    {name: "2 Heart Squids (Abandoned Factory)", types: ["Heart_Squid"], index: 119},
    {name: "Cannon maze Heart Squid (Frostbite Island)", types: ["Heart_Squid"], index: 120},
    {name: "1 Cacklebat (Mud Bog Island)", types: ["Cacklebats"], index: 121},
    {name: "2 Heart Squids (Spittle Maze)", types: ["Heart_Squid"], index: 122}
  ];
  self.bingoList[22] = [
    {name: "No Risky Shuffle (Tan Line Island)", types: ["Move_Restriction"], index: 123},
    {name: "Get 1 key (Spittle Maze)", types: ["Get_Keys"], index: 124},
    {name: "No Risky Shuffle (Saliva Island)", types: ["Move_Restriction"], index: 125},
    {name: "No Risky Shuffle (Spiderweb Island)", types: ["Move_Restriction"], index: 126},
    {name: "Map (Cackle Tower)", types: ["Map"], index: 127},
    {name: "2 Cacklebats (Scuttle Town)", types: ["Cacklebats"], index: 128}
  ];
  self.bingoList[23] = [
    {name: "2 Heart Squids (Lost Catacombs)", types: ["Heart_Squid"], index: 129},
    {name: "No Risky Shuffle (Scuttle Town)", types: ["Move_Restriction"], index: 130},
    {name: "No Risky Shuffle (Frostbite Island)", types: ["Move_Restriction"], index: 131},
    {name: "1 Cacklebat (Saliva Island)", types: ["Cacklebats"], index: 132},
    {name: "2 Heart Squids (Spiderweb Island)", types: ["Heart_Squid"], index: 133}
  ];
  self.bingoList[24] = [
    {name: "1 Cacklebat (Spiderweb Island)", types: ["Cacklebats"], index: 134},
    {name: "2 Heart Squids (Saliva Island)", types: ["Heart_Squid"], index: 135},
    {name: "Map (Spittle Maze)", types: ["Map"], index: 136},
    {name: "1 Cacklebat (Frostbite Island)", types: ["Cacklebats"], index: 137},
    {name: "Ring (Saliva Island)", types: [], index: 138},
    {name: "Map (Oubliette of Suffering)", types: ["Map"], index: 139}
  ];

  // For bingo cards that are rendered from the URL.
  self.goalList = [
    "No shopping",
    "90% completion",
    "20 Dark Magic",
    "80% completion",
    "70% completion",
    "16 Dark Magic",
    "Exit through the exit (Drizzle Fountain)",
    "(Super) Pike Ball damage only (Dagron)",
    "7 hearts",
    "3 Pirate Master trials",
    "700 gems",
    "12 Dark Magic",
    "6 hearts",
    "Heal 15 full hearts in the bath house",
    "600 gems",
    "2 Pirate Master trials",
    "Go to court",
    "Complete 7 gauntlets",
    "Secret sewer gauntlet",
    "2 trades with the Mayor",
    "Keep Library Card",
    "(Super) Pike Ball damage only (Steel Maggot)",
    "Heal 10 full hearts in the bath house",
    "(Super) Pike Ball damage only (Pirate Master)",
    "Complete 3 gauntlets (Cackle tower)",
    "1 Pirate Master trial",
    "Kill 5 bosses without advance Risky items",
    "Get 3 keys (Tan Line Temple)",
    "Complete 6 gauntlets",
    "Kill 3 bosses with no powerups",
    "Start the fan (Cackle Tower)",
    "No Drizzle Fountain (Spittle Maze)",
    "No Risky Shuffle (Oubliette of Suffering)",
    "No Pirate Flares (Mud Bog Island)",
    "Learn Power Kick",
    "8 Dark Magic",
    "5 hearts",
    "500 gems",
    "(Super) Pike Ball damage only (Cyclops Plant)",
    "(Super) Pike Ball damage only (Empress Spider)",
    "Complete 5 gauntlets",
    "Get 5 keys (Abandoned Factory)",
    "(Super) Pike Ball damage only (Squid Baron)",
    "400 gems",
    "Get 2 keys (Tan Line Temple)",
    "4 Cacklebats (Scuttle Town)",
    "Kill 10 Nagas (Village of Lost Souls)",
    "12 distinct save men",
    "Get 3 keys (Lost Catacombs)",
    "Second-level hair upgrades",
    "No Risky Shuffle (Propeller Town)",
    "No Risky Shuffle (Village of Lost Souls)",
    "1 Heart Squid (Tan Line Temple)",
    "No Pirate Flares (Spiderweb Island)",
    "No Pirate Flares (Tan Line Island)",
    "Unlock the ground floor (Lost Catacombs)",
    "Complete 4 gauntlets",
    "Kill 2 bosses with no upgrades",
    "Kill 4 bosses without advance Risky items",
    "No Bubble Shield (Pirate Master)",
    "Complete 2 gauntlets (Oubliette of Suffering)",
    "4 Dark Magic",
    "3 Heart Squids (Frostbite Island)",
    "1 trade with the Mayor",
    "No Pirate Flares (Frostbite Island)",
    "Step on five conveyor belts (Abandoned Factory)",
    "Get 2 keys (Oubliette of Suffering)",
    "2 Heart Squids (Oubliette of Suffering)",
    "Get 4 keys (Abandoned Factory)",
    "No Pirate Flares (Saliva Island)",
    "No Super Pike Ball (Empress Spider)",
    "Pirate Flare out (Lonely Grave)",
    "Heal 5 full hearts in the bath house",
    "Scimitar Polish",
    "Kill 10 archers (Village of Lost Souls)",
    "Kill 7 Scorpion Girls (Tan Line Island)",
    "Keep Death Mask",
    "Kill 10 muck enemies (Mud Bog Island)",
    "No hair whips (Squid Baron)",
    "No Risky's Scimitar (Cyclops Plant)",
    "8 distinct save men",
    "Learn Recover",
    "2 Cacklebats (Tan Line Island)",
    "2 Cacklebats (Mud Bog Island)",
    "3 Cacklebats (Scuttle Town)",
    "Complete 2 gauntlets (Cackle Tower)",
    "Get 2 keys (Lost Catacombs)",
    "Get 3 keys (Cackle Tower)",
    "No Risky's Cannon (Dagron)",
    "2 Heart Squids (Cackle Tower)",
    "No Pirate Flares (Scuttle Town)",
    "Kill 5 Scorpion Girls (Tan Line Island)",
    "Learn Backdash",
    "1 Pistol Tune-Up",
    "2 Cacklebats (Frostbite Island)",
    "Kill 6 Mermaids (Saliva Island)",
    "Kill 15 skeletons (Cackle Tower)",
    "Kill 20 zombie bodies (Spiderweb Island)",
    "First-level hair upgrades",
    "Complete 1 gauntlet (Oubliette of Suffering)",
    "3 Heart Squids (Mud Bog Island)",
    "Kill 15 wolves (Frostbite Island)",
    "Map (Abandoned Factory)",
    "Enter every normal room (Ye Royal Sewers)",
    "No Risky Shuffle (Lost Catacombs)",
    "No Risky Shuffle (Mud Bog Island)",
    "No Risky Shuffle (Abandoned Factory)",
    "No crouching (Steel Maggot)",
    "No Risky Shuffle (Cackle Tower)",
    "2 Cacklebats (Saliva Island)",
    "4 Heart Squids (Scuttle Town)",
    "5 distinct save men",
    "Complete 2 gauntlets (Spittle Maze)",
    "3 Heart Squids (Scuttle Town)",
    "Map (Lost Catacombs)",
    "Get 1 key (Oubliette of Suffering)",
    "1 Cacklebat (Tan Line Island)",
    "2 Cacklebats (Spiderweb Island)",
    "Kill 9 guards (Scuttle Town)",
    "2 Heart Squids (Abandoned Factory)",
    "Cannon maze Heart Squid (Frostbite Island)",
    "1 Cacklebat (Mud Bog Island)",
    "2 Heart Squids (Spittle Maze)",
    "No Risky Shuffle (Tan Line Island)",
    "Get 1 key (Spittle Maze)",
    "No Risky Shuffle (Saliva Island)",
    "No Risky Shuffle (Spiderweb Island)",
    "Map (Cackle Tower)",
    "2 Cacklebats (Scuttle Town)",
    "2 Heart Squids (Lost Catacombs)",
    "No Risky Shuffle (Scuttle Town)",
    "No Risky Shuffle (Frostbite Island)",
    "1 Cacklebat (Saliva Island)",
    "2 Heart Squids (Spiderweb Island)",
    "1 Cacklebat (Spiderweb Island)",
    "2 Heart Squids (Saliva Island)",
    "Map (Spittle Maze)",
    "1 Cacklebat (Frostbite Island)",
    "Ring (Saliva Island)",
    "Map (Oubliette of Suffering)",
  ];

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
    var listsRemaining = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
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
    self.renderBoardFromUrl(self.board, self.goalList);
  } else {
    self.generateBoard(self.bingoList);
  }
};
