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

    self.selectedLocationSet = new Set();
    self.selectedGroupSet = new Set();

    self.fullGroupSet = new Set();
    self.locationString = "No locations selected.";
    self.groupErrorMessage = undefined;

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
        self.selectedLocationSet = new Set();
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

    self.toggleLocationSelection = function toggleLocationSelection(location) {
        if (self.selectedLocationSet.has(location)) {
            self.selectedLocationSet.delete(location);
        } else {
            self.selectedLocationSet.add(location);
        }
    };

    self.toggleGroupSelection = function toggleGroupSelection(groupName) {
        if (self.selectedGroupSet.has(groupName)) {
            self.selectedGroupSet.delete(groupName);
        } else {
            self.selectedGroupSet.add(groupName);
        }
        self.groupErrorMessage = undefined;
    };

    self.isLocationSelected = function isLocationSelected(location) {
        return self.selectedLocationSet.has(location);
    }

    self.isGroupSelected = function isGroupSelected(groupName) {
        return self.selectedGroupSet.has(groupName);
    }

    self.addSelectedLocations = function addLocation() {
        for (let selectedLocation of self.selectedLocationSet) {
            self.getCurrentSet().add(selectedLocation);
        }
        self.selectedLocationSet = new Set();
        self.recalculateGroups();
    };

    self.removeSelectedLocations = function removeLocation() {
        for (let selectedLocation of self.selectedLocationSet) {
            self.getCurrentSet().delete(selectedLocation);
        }
        self.selectedLocationSet = new Set();
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

    self.removeSelectedGroups = function removeSelectedGroups() {
        // Check every set to see if removing these groups would be valid.
        let errorSets = [];
        let exactMatches = 0;
        for (let groupName of self.selectedGroupSet) {
            if (self.exactSet.has(groupName)) {
                exactMatches += 1;
            }
            if (exactMatches >= self.exactSet.size) {
                errorSets.push("exact-specificity");
                break;
            }
        }
        let highMatches = 0;
        for (let groupName of self.selectedGroupSet) {
            if (self.highSet.has(groupName)) {
                highMatches += 1;
            }
            if (highMatches >= self.highSet.size) {
                errorSets.push("high-specificity");
                break;
            }
        }
        let midMatches = 0;
        for (let groupName of self.selectedGroupSet) {
            if (self.midSet.has(groupName)) {
                midMatches += 1;
            }
            if (midMatches >= self.midSet.size) {
                errorSets.push("mid-specificity");
                break;
            }
        }
        let lowMatches = 0;
        for (let groupName of self.selectedGroupSet) {
            if (self.lowSet.has(groupName)) {
                lowMatches += 1;
            }
            if (lowMatches >= self.lowSet.size) {
                errorSets.push("low-specificity");
                break;
            }
        }

        // If we have any errors, display an error message and return.
        if (errorSets.length > 0) {
            self.groupErrorMessage = self.createGroupErrorMessage(errorSets);
            self.selectedGroupSet = new Set();
            return;
        }

        // At this point, we can remove the groups.
        for (let groupName of self.selectedGroupSet) {
            self.fullGroupSet.delete(groupName);
            self.exactSet.delete(groupName);
            self.highSet.delete(groupName);
            self.midSet.delete(groupName);
            self.lowSet.delete(groupName);
        }

        // Unselect all groups.
        self.selectedGroupSet = new Set();

        // Change the location string.
        self.locationString = self.getLocationString();
    };

    self.createGroupErrorMessage = function createGroupErrorMessage(errorSets) {
        let setMessage = errorSets.length > 1
            ? `${errorSets.slice(0, -1).join(", ")} and ${errorSets.slice(-1)[0]} sets`
            : `${errorSets[0]} set`;
        return `removing these groups would cause the ${setMessage} to be empty.`;
    };
};
