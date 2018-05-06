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

  // ****************
  // LIST DEFINITIONS
  // ****************

  self.offsetList = [0,5,11,17,23,29,35,41,46,52,58,63,69,74,79,85,91,96,101,107,112,118,123,129,134];
  self.bingoList = [];
  self.bingoList[0] = [
    {name: "No shopping", types: ["Shop"]},
    {name: "90% completion", types: ["Percent"]},
    {name: "20 Dark Magic", types: ["Dark_Magic"]},
    {name: "80% completion", types: ["Percent"]},
    {name: "70% completion", types: ["Percent"]}
  ];
  self.bingoList[1] = [
    {name: "16 Dark Magic", types: ["Dark_Magic"]},
    {name: "Exit through the exit (Drizzle Fountain)", types: []},
    {name: "(Super) Pike Ball damage only (Dagron)", types: ["Boss_Restriction","Dagron_Restriction"]},
    {name: "7 hearts", types: ["Hearts"]},
    {name: "3 Pirate Master trials", types: ["Trials"]},
    {name: "700 gems", types: ["Gem_Count"]}
  ];
  self.bingoList[2] = [
    {name: "6 hearts", types: ["Hearts"]},
    {name: "12 Dark Magic", types: ["Dark_Magic"]},
    {name: "Heal 15 full hearts in the bath house", types: ["Heal_Hearts"]},
    {name: "600 gems", types: ["Gem_Count"]},
    {name: "2 Pirate Master trials", types: ["Trials"]},
    {name: "Go to court", types: []}
  ];
  self.bingoList[3] = [
    {name: "Complete 7 gauntlets", types: ["Gauntlets"]},
    {name: "Secret sewer gauntlet", types: ["Gauntlets"]},
    {name: "2 trades with the Mayor", types: ["Mayor_Trade"]},
    {name: "Keep Library Card", types: ["Keep_Item"]},
    {name: "(Super) Pike Ball damage only (Steel Maggot)", types: ["Boss_Restriction","Maggot_Restriction"]},
    {name: "Heal 10 full hearts in the bath house", types: ["Heal_Hearts"]}
  ];
  self.bingoList[4] = [
    {name: "(Super) Pike Ball damage only (Pirate Master)", types: ["Boss_Restriction","Master_Restriction"]},
    {name: "Complete 3 gauntlets (Cackle tower)", types: ["Gauntlets"]},
    {name: "1 Pirate Master trial", types: ["Trials"]},
    {name: "Kill 5 bosses without advance Risky items", types: ["Boss_Restriction","Risky_Item"]},
    {name: "Get 3 keys (Tan Line Temple)", types: ["Get_Keys"]},
    {name: "Complete 6 gauntlets", types: ["Gauntlets"]}
  ];
  self.bingoList[5] = [
    {name: "Kill 3 bosses with no powerups", types: ["Boss_Restriction","No_Powerups"]},
    {name: "Start the fan (Cackle Tower)", types: []},
    {name: "No Drizzle Fountain (Spittle Maze)", types: ["Restriction"]},
    {name: "No Risky Shuffle (Oubliette of Suffering)", types: ["Move_Restriction"]},
    {name: "No Pirate Flares (Mud Bog Island)", types: ["Item_Restriction"]},
    {name: "Learn Power Kick", types: ["Learn_Move"]}
  ];
  self.bingoList[6] = [
    {name: "8 Dark Magic", types: ["Dark_Magic"]},
    {name: "5 hearts", types: ["Hearts"]},
    {name: "500 gems", types: ["Gem_Count"]},
    {name: "(Super) Pike Ball damage only (Cyclops Plant)", types: ["Boss_Restriction","Cyclops_Restriction"]},
    {name: "(Super) Pike Ball damage only (Empress Spider)", types: ["Boss_Restriction","Spider_Restriction"]},
    {name: "Complete 5 gauntlets", types: ["Gauntlets"]}
  ];
  self.bingoList[7] = [
    {name: "Get 5 keys (Abandoned Factory)", types: ["Get_Keys"]},
    {name: "(Super) Pike Ball damage only (Squid Baron)", types: ["Boss_Restriction","Squid_Restriction"]},
    {name: "400 gems", types: ["Gem_Count"]},
    {name: "Get 2 keys (Tan Line Temple)", types: ["Get_Keys"]},
    {name: "4 Cacklebats (Scuttle Town)", types: ["Cacklebats"]}
  ];
  self.bingoList[8] = [
    {name: "Kill 10 Nagas (Village of Lost Souls)", types: ["Kill_Quest"]},
    {name: "12 distinct save men", types: ["Save_Man"]},
    {name: "Get 3 keys (Lost Catacombs)", types: ["Get_Keys"]},
    {name: "Second-level hair upgrades", types: ["Upgrade"]},
    {name: "No Risky Shuffle (Propeller Town)", types: ["Move_Restriction"]},
    {name: "No Risky Shuffle (Village of Lost Souls)", types: ["Move_Restriction"]}
  ];
  self.bingoList[9] = [
    {name: "1 Heart Squid (Tan Line Temple)", types: ["Heart_Squid"]},
    {name: "No Pirate Flares (Spiderweb Island)", types: ["Item_Restriction"]},
    {name: "No Pirate Flares (Tan Line Island)", types: ["Item_Restriction"]},
    {name: "Unlock the ground floor (Lost Catacombs)", types: []},
    {name: "Complete 4 gauntlets", types: ["Gauntlets"]},
    {name: "Kill 2 bosses with no upgrades", types: ["Boss_Restriction","No_Powerups"]}
  ];
  self.bingoList[10] = [
    {name: "Kill 4 bosses without advance Risky items", types: ["Boss_Restriction","Risky_Item"]},
    {name: "No Bubble Shield (Pirate Master)", types: ["Item_Restriction","Master_Restriction"]},
    {name: "Complete 2 gauntlets (Oubliette of Suffering)", types: ["Gauntlets"]},
    {name: "4 Dark Magic", types: ["Dark_Magic"]},
    {name: "3 Heart Squids (Frostbite Island)", types: ["Heart_Squid"]}
  ];
  self.bingoList[11] = [
    {name: "1 trade with the Mayor", types: ["Mayor_Trade"]},
    {name: "No Pirate Flares (Frostbite Island)", types: ["Item_Restriction"]},
    {name: "Step on five conveyor belts (Abandoned Factory)", types: []},
    {name: "Get 2 keys (Oubliette of Suffering)", types: ["Get_Keys"]},
    {name: "2 Heart Squids (Oubliette of Suffering)", types: ["Heart_Squid"]},
    {name: "Get 4 keys (Abandoned Factory)", types: ["Get_Keys"]}
  ];
  self.bingoList[12] = [
    {name: "No Pirate Flares (Saliva Island)", types: ["Item_Restriction"]},
    {name: "No Super Pike Ball (Empress Spider)", types: ["Boss_Restriction","Spider_Restriction"]},
    {name: "Pirate Flare out (Lonely Grave)", types: []},
    {name: "Heal 5 full hearts in the bath house", types: ["Heal_Hearts"]},
    {name: "Scimitar Polish", types: ["Upgrade"]}
  ];
  self.bingoList[13] = [
    {name: "Kill 10 archers (Village of Lost Souls)", types: ["Kill_Quest"]},
    {name: "Kill 7 Scorpion Girls (Tan Line Island)", types: ["Kill_Quest"]},
    {name: "Keep Death Mask", types: ["Keep_Item"]},
    {name: "Kill 10 muck enemies (Mud Bog Island)", types: ["Kill_Quest"]},
    {name: "No hair whips (Squid Baron)", types: ["Boss_Restriction","Squid_Restriction"]}
  ];
  self.bingoList[14] = [
    {name: "No Risky's Scimitar (Cyclops Plant)", types: ["Boss_Restriction","Cyclops_Restriction"]},
    {name: "8 distinct save men", types: ["Save_Man"]},
    {name: "Learn Recover", types: ["Upgrade"]},
    {name: "2 Cacklebats (Tan Line Island)", types: ["Cacklebats"]},
    {name: "2 Cacklebats (Mud Bog Island)", types: ["Cacklebats"]},
    {name: "3 Cacklebats (Scuttle Town)", types: ["Cacklebats"]}
  ];
  self.bingoList[15] = [
    {name: "Complete 2 gauntlets (Cackle Tower)", types: ["Gauntlets"]},
    {name: "Get 2 keys (Lost Catacombs)", types: ["Get_Keys"]},
    {name: "Get 3 keys (Cackle Tower)", types: ["Get_Keys"]},
    {name: "No Risky's Cannon (Dagron)", types: ["Boss_Restriction","Dagron_Restriction"]},
    {name: "2 Heart Squids (Cackle Tower)", types: ["Heart_Squid"]},
    {name: "No Pirate Flares (Scuttle Town)", types: ["Item_Restriction"]}
  ];
  self.bingoList[16] = [
    {name: "Kill 5 Scorpion Girls (Tan Line Island)", types: ["Kill_Quest"]},
    {name: "Learn Backdash", types: ["Upgrade"]},
    {name: "1 Pistol Tune-Up", types: ["Upgrade"]},
    {name: "2 Cacklebats (Frostbite Island)", types: ["Cacklebats"]},
    {name: "Kill 6 Mermaids (Saliva Island)", types: ["Kill_Quest"]}
  ];
  self.bingoList[17] = [
    {name: "Kill 15 skeletons (Cackle Tower)", types: ["Kill_Quest"]},
    {name: "Kill 20 zombie bodies (Spiderweb Island)", types: ["Kill_Quest"]},
    {name: "First-level hair upgrades", types: ["Upgrade"]},
    {name: "Complete 1 gauntlet (Oubliette of Suffering)", types: ["Gauntlets"]},
    {name: "3 Heart Squids (Mud Bog Island)", types: ["Heart_Squid"]}
  ];
  self.bingoList[18] = [
    {name: "Kill 15 wolves (Frostbite Island)", types: ["Kill_Quest"]},
    {name: "Map (Abandoned Factory)", types: ["Map"]},
    {name: "Enter every normal room (Ye Royal Sewers)", types: []},
    {name: "No Risky Shuffle (Lost Catacombs)", types: ["Move_Restriction"]},
    {name: "No Risky Shuffle (Mud Bog Island)", types: ["Move_Restriction"]},
    {name: "No Risky Shuffle (Abandoned Factory)", types: ["Move_Restriction"]}
  ];
  self.bingoList[19] = [
    {name: "No crouching (Steel Maggot)", types: ["Boss_Restriction","Maggot_Restriction"]},
    {name: "No Risky Shuffle (Cackle Tower)", types: ["Move_Restriction"]},
    {name: "2 Cacklebats (Saliva Island)", types: ["Cacklebats"]},
    {name: "4 Heart Squids (Scuttle Town)", types: ["Heart_Squid"]},
    {name: "5 distinct save men", types: ["Save_Man"]}
  ];
  self.bingoList[20] = [
    {name: "Complete 2 gauntlets (Spittle Maze)", types: ["Gauntlets"]},
    {name: "3 Heart Squids (Scuttle Town)", types: ["Heart_Squid"]},
    {name: "Map (Lost Catacombs)", types: ["Map"]},
    {name: "Get 1 key (Oubliette of Suffering)", types: ["Get_Keys"]},
    {name: "1 Cacklebat (Tan Line Island)", types: ["Cacklebats"]},
    {name: "2 Cacklebats (Spiderweb Island)", types: ["Cacklebats"]}
  ];
  self.bingoList[21] = [
    {name: "Kill 9 guards (Scuttle Town)", types: ["Kill_Quest"]},
    {name: "2 Heart Squids (Abandoned Factory)", types: ["Heart_Squid"]},
    {name: "Cannon maze Heart Squid (Frostbite Island)", types: ["Heart_Squid"]},
    {name: "1 Cacklebat (Mud Bog Island)", types: ["Cacklebats"]},
    {name: "2 Heart Squids (Spittle Maze)", types: ["Heart_Squid"]}
  ];
  self.bingoList[22] = [
    {name: "No Risky Shuffle (Tan Line Island)", types: ["Move_Restriction"]},
    {name: "Get 1 key (Spittle Maze)", types: ["Get_Keys"]},
    {name: "No Risky Shuffle (Saliva Island)", types: ["Move_Restriction"]},
    {name: "No Risky Shuffle (Spiderweb Island)", types: ["Move_Restriction"]},
    {name: "Map (Cackle Tower)", types: ["Map"]},
    {name: "2 Cacklebats (Scuttle Town)", types: ["Cacklebats"]}
  ];
  self.bingoList[23] = [
    {name: "2 Heart Squids (Lost Catacombs)", types: ["Heart_Squid"]},
    {name: "No Risky Shuffle (Scuttle Town)", types: ["Move_Restriction"]},
    {name: "No Risky Shuffle (Frostbite Island)", types: ["Move_Restriction"]},
    {name: "1 Cacklebat (Saliva Island)", types: ["Cacklebats"]},
    {name: "2 Heart Squids (Spiderweb Island)", types: ["Heart_Squid"]}
  ];
  self.bingoList[24] = [
    {name: "1 Cacklebat (Spiderweb Island)", types: ["Cacklebats"]},
    {name: "2 Heart Squids (Saliva Island)", types: ["Heart_Squid"]},
    {name: "Map (Spittle Maze)", types: ["Map"]},
    {name: "1 Cacklebat (Frostbite Island)", types: ["Cacklebats"]},
    {name: "Ring (Saliva Island)", types: []},
    {name: "Map (Oubliette of Suffering)", types: ["Map"]}
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

  self.generateBoard = function(fullGoalList) {

  };

  // *******************
  // CHOOSE YOUR DESTINY
  // *******************
  if (self.board) {
    self.renderBoardFromUrl(self.board, self.goalList);
  }
};
