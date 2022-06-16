var comparatorCtrl = function comparatorCtrl($http) {
    var self = this;

    self.displayedTab = 'splits';
    self.splitTextContents = '';
    self.splitsList = [];

    self.firstRunnerName = '';
    self.secondRunnerName = '';
    self.firstRunnerSplits = [];
    self.secondRunnerSplits = [];

    self.firstSplitSelect = '0';
    self.secondSplitSelect = '0';
    self.firstRunnerNewSplitTime = '';
    self.secondRunnerNewSplitTime = '';

    self.latestCommonSplit = -1;
    self.leadingRunner = -1;
    self.timeDifference = -1;
    self.timeDifferenceString = '';

    self.predefinedSplits = [];
    self.predefinedSplitSelect = '-1';
    $http.get('splits.json').then(function(response) {
        const games = response.data;
        for (var game of games) {
            for (var category of game.categories) {
                self.predefinedSplits.push({
                    name: `${game.name} (${category.name})`,
                    splits: category.splits
                });
            }
        }
    });

    self.precision = 2;

    self.selectSplits = function selectSplits() {
        if (self.predefinedSplitSelect == '-1') {
            self.splitTextContents = '';
            return;
        }

        var selectedSplits = self.predefinedSplits[parseInt(self.predefinedSplitSelect)];
        var splitString = '';
        for (var split of selectedSplits.splits) {
            splitString += `${split}\n`;
        }
        self.splitTextContents = splitString;
    };

    self.begin = function begin() {
        var parsedList = self.splitTextContents.split('\n');
        // Create a list of split names, and also initialize the splits arrays.
        for (var parsedSplit of parsedList) {
            if (parsedSplit) {
                self.splitsList.push(parsedSplit);
                self.firstRunnerSplits.push(self.newSplitItem(parsedSplit));
                self.secondRunnerSplits.push(self.newSplitItem(parsedSplit));
            }
        }

        if (self.splitsList.length > 0 && self.firstRunnerName && self.secondRunnerName) {
            self.displayedTab = 'data-entry';
        }
    };

    self.newSplitItem = function newSplitItem(splitName) {
        return {
            name: splitName,
            time: undefined
        };
    };

    self.addSplitTime = function addSplitTime(index) {
        if (index == 0) {
            var newTime = self.stringTimeToTime(self.firstRunnerNewSplitTime);
            var chosenSplit = parseInt(self.firstSplitSelect);
            self.firstRunnerSplits[chosenSplit].time = newTime;
        } else {
            var newTime = self.stringTimeToTime(self.secondRunnerNewSplitTime);
            var chosenSplit = parseInt(self.secondSplitSelect);
            self.secondRunnerSplits[chosenSplit].time = newTime;
        }
        self.recalculateLead();
    };

    self.recalculateLead = function recalculateLead() {
        var firstLatestCommonTime = -1;
        var secondLatestCommonTime = -1;
        self.latestCommonSplit = -1;
        for (var i = 0; i < this.splitsList.length; i++) {
            var firstTime = self.firstRunnerSplits[i].time;
            var secondTime = self.secondRunnerSplits[i].time;
            if (firstTime !== undefined && secondTime !== undefined) {
                firstLatestCommonTime = firstTime;
                secondLatestCommonTime = secondTime;
                self.latestCommonSplit = i;
            }
        }

        var diffTime = Math.abs(firstLatestCommonTime - secondLatestCommonTime);
        self.timeDifference = diffTime;
        self.timeDifferenceString = self.timeToStringTime(diffTime);

        if (firstLatestCommonTime < secondLatestCommonTime) {
            self.leadingRunner = 0;
        } else if (secondLatestCommonTime < firstLatestCommonTime) {
            self.leadingRunner = 1;
        } else {
            self.leadingRunner = -1;
        }
    };

    self.stringTimeToTime = function stringTimeToTime(strTime) {
        var parsedTime = strTime.split(':');
        if (parsedTime.length == 1) {
            return parseFloat(parsedTime[0]);
        }
        if (parsedTime.length == 2) {
            var minutes = parseInt(parsedTime[0]);
            var seconds = parseFloat(parsedTime[1]);
            return (minutes * 60) + seconds;
        }
        // We stop at hours.
        var hours = parseInt(parsedTime[0]);
        var minutes = parseInt(parsedTime[1]);
        var seconds = parseFloat(parsedTime[2]);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    self.timeToStringTime = function timeToStringTime(numTime) {
        var hours = 0;
        var timeWithoutHours = numTime;
        if (numTime >= 3600) {
            hours = Math.floor(numTime / 3600);
            timeWithoutHours = timeWithoutHours % 3600;
        }
        var minutes = Math.floor(timeWithoutHours / 60);
        var minutesStr = minutes.toString();
        var seconds = timeWithoutHours % 60;
        var secondsStr = seconds.toFixed(self.precision);
        if (hours == 0 && minutes == 0) {
            return secondsStr;
        }

        if (secondsStr.indexOf('.') <= 1) {
            secondsStr = `0${secondsStr}`;
        }
        if (hours == 0) {
            return `${minutes.toString()}:${secondsStr}`;
        }

        if (minutes < 10) {
            minutesStr = `0${minutesStr}`;
        }
        return `${hours.toString()}:${minutesStr}:${secondsStr}`;
    };
    
    self.restart = function restart() {
        self.splitsList = [];
        self.firstRunnerSplits = [];
        self.secondRunnerSplits = [];
        self.displayedTab = 'splits';
    };
};
