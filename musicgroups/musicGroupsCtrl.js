var musicGroupsCtrl = function musicGroupsCtrl($http) {
    let self = this;

    self.bgmList = [];
    self.fanfareList = [];

    self.trackType = 'bgm';
    // This data is maintained.
    self.bgmSet = new Set();
    self.fanfareSet = new Set();
    // The below data is regularly recalculated.
    self.exactSet = new Set();
    self.highSet = new Set();
    self.midSet = new Set();
    self.lowSet = new Set();

    self.selectedLocation = undefined;
    self.selectedGroup = undefined;

    self.fullGroupSet = new Set();
    self.locationString = "No locations selected.";

    $http.get('groups.json').then(function(response) {
        const locations = response.data;
        for (let bgm of locations.bgm) {
            self.bgmList.push(bgm);
        }
        for (let fanfare of locations.fanfare) {
            self.fanfareList.push(fanfare);
        }
    });

    // For testing only.
    /*self.bgmList = [
        {
            name: "Hyrule Field",
            specificity: {
                exact: "HyruleField",
                high: "Fields",
                mid: "Outdoors",
                low: "Overworld"
            }
        },
        {
            name: "Temple of Time",
            specificity: {
                exact: "TempleOfTime",
                high: "MagicalPlace",
                mid: "Indoors",
                low: "Overworld"
            }
        },
        {
            name: "Inside Jabu-Jabu's Belly",
            specificity: {
                exact: "JabuJabu",
                high: "ChildDungeon",
                mid: "ChildDungeon",
                low: "Dungeon"
            }
        },
        {
            name: "Dodongo's Cavern / Death Mountain Crater / Dampe's Race / Gerudo Training Grounds",
            specificity: {
                exact: "DodongosCavern",
                high: "ChildDungeon",
                mid: "ChildDungeon",
                low: "Dungeon"
            }
        },
        {
            name: "Windmill Hut",
            specificity: {
                exact: "WindmillHut",
                high: "WindmillHut",
                mid: "Indoors",
                low: "Overworld"
            }
        }
    ];
    self.fanfareList = [
        {
            name: "Heart Container Get",
            specificity: {
                exact: "HeartContainerGet",
                high: "ItemFanfare",
                mid: "ItemFanfare",
                low: "EventFanfare"
            }
        },
        {
            name: "Game Over",
            specificity: {
                exact: "GameOver",
                high: "GameOver",
                mid: "GameOver",
                low: "EventFanfare"
            }
        },
        {
            name: "Prelude of Light",
            specificity: {
                exact: "PreludeOfLight",
                high: "WarpSong",
                mid: "WarpSong",
                low: "SongFanfare"
            }
        },
        {
            name: "Sun's Song",
            specificity: {
                exact: "SunsSong",
                high: "UtilitySong",
                mid: "UtilitySong",
                low: "SongFanfare"
            }
        }
    ];*/

    self.getCurrentList = function getCurrentList() {
        return self.trackType === 'bgm' ? self.bgmList : self.fanfareList;
    };

    self.getCurrentSet = function getCurrentSet() {
        return self.trackType === 'bgm' ? self.bgmSet : self.fanfareSet;
    };

    self.updateTrackType = function updateTrackType() {
        self.selectedLocation = undefined;
        self.recalculateGroups();
    };

    self.isLocationIncluded = function isLocationIncluded() {
        return function(location) {
            return self.getCurrentSet().has(location);
        }
    };

    self.isLocationExcluded = function isLocationExcluded() {
        return function(location) {
            return !self.getCurrentSet().has(location);
        }
    };

    self.selectLocation = function selectLocation(location) {
        self.selectedLocation = location;
    };

    self.selectGroup = function selectGroup(groupName) {
        self.selectedGroup = groupName;
    };

    self.addSelectedLocation = function addLocation() {
        self.getCurrentSet().add(self.selectedLocation);
        self.recalculateGroups();
    };

    self.removeSelectedLocation = function removeLocation() {
        self.getCurrentSet().delete(self.selectedLocation);
        self.recalculateGroups();
    };

    self.recalculateGroups = function recalculateGroups() {
        self.exactSet = new Set();
        self.highSet = new Set();
        self.midSet = new Set();
        self.lowSet = new Set();

        let currentSet = self.getCurrentSet();
        for (let location of currentSet) {
            self.exactSet.add(location.specificity.exact);
            self.highSet.add(location.specificity.high);
            self.midSet.add(location.specificity.mid);
            self.lowSet.add(location.specificity.low);
        }

        let groupSet = new Set();
        for (let groupName of self.exactSet) {
            groupSet.add(groupName);
        }
        for (let groupName of self.highSet) {
            groupSet.add(groupName);
        }
        for (let groupName of self.midSet) {
            groupSet.add(groupName);
        }
        for (let groupName of self.lowSet) {
            groupSet.add(groupName);
        }
        self.fullGroupSet = groupSet;

        self.locationString = self.getLocationString();
    };

    self.getLocationString = function getLocationString() {
        if (self.fullGroupSet.size === 0) {
            return "No locations selected.";
        }

        let groupList = Array.from(self.fullGroupSet);
        return groupList.join(",");
    };

    self.getListFromSet = function getListFromSet(providedSet) {
        return Array.from(providedSet);
    };

    self.getStringFromSet = function getStringFromSet(providedSet) {
        let setList = Array.from(providedSet);
        return setList.join(", ");
    };

    self.removeSelectedGroup = function removeSelectedGroup() {
        // Check every set to see if removing this group is valid.
        if ((self.exactSet.has(self.selectedGroup) && self.exactSet.size === 1)
            || (self.highSet.has(self.selectedGroup) && self.highSet.size === 1)
            || (self.midSet.has(self.selectedGroup) && self.midSet.size === 1)
            || (self.lowSet.has(self.selectedGroup) && self.lowSet.size === 1)) {
            self.selectedGroup = undefined;
            return;
        }

        // At this point, we can remove the group.
        self.fullGroupSet.delete(self.selectedGroup);
        self.exactSet.delete(self.selectedGroup);
        self.highSet.delete(self.selectedGroup);
        self.midSet.delete(self.selectedGroup);
        self.lowSet.delete(self.selectedGroup);

        // Unselect the group.
        self.selectedGroup = undefined;

        // Change the location string.
        self.locationString = self.getLocationString();
    };
};
