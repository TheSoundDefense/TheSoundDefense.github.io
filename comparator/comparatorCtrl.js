var comparatorCtrl = function comparatorCtrl($http) {
    var self = this;

    self.displayedTab = 'splits';
    self.splitTextContents = '';
    self.splitsList = [];
    self.timingMethod = 'igt_cumulative';

    self.firstRunnerName = '';
    self.secondRunnerName = '';
    self.firstRunnerSplits = [];
    self.secondRunnerSplits = [];
    self.firstRunnerCumulativeTimes = [];
    self.secondRunnerCumulativeTimes = [];

    self.firstSplitSelect = '0';
    self.secondSplitSelect = '0';
    self.firstRunnerNewSplitTime = '';
    self.secondRunnerNewSplitTime = '';

    self.firstRunnerAdjustments = 0;
    self.secondRunnerAdjustments = 0;
    self.firstRunnerAdjustmentDirection = 'add';
    self.secondRunnerAdjustmentDirection = 'add';
    self.firstRunnerNewAdjustment = '';
    self.secondRunnerNewAdjustment = '';

    self.latestCommonSplit = -1;
    self.leadingRunner = -1;
    self.deltas = [];
    self.timeDifference = -1;
    self.timeDifferenceString = '';
    self.raceComplete = false;

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
                self.firstRunnerCumulativeTimes.push(self.newSplitItem(parsedSplit));
                self.secondRunnerCumulativeTimes.push(self.newSplitItem(parsedSplit));
                self.deltas.push({
                    leader: undefined,
                    timeDelta: undefined,
                    gain: undefined,
                    gainingRunner: undefined
                });
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
            // Update the select box, and erase the input.
            if (chosenSplit < self.splitsList.length - 1) {
                self.firstSplitSelect = (chosenSplit + 1).toString();
            }
            self.firstRunnerNewSplitTime = '';
        } else {
            var newTime = self.stringTimeToTime(self.secondRunnerNewSplitTime);
            var chosenSplit = parseInt(self.secondSplitSelect);
            self.secondRunnerSplits[chosenSplit].time = newTime;
            // Update the select box, and erase the input.
            if (chosenSplit < self.splitsList.length - 1) {
                self.secondSplitSelect = (chosenSplit + 1).toString();
            }
            self.secondRunnerNewSplitTime = '';
        }
        self.recalculateLead();
    };

    self.addAdjustment = function addAdjustment(index) {
        if (index == 0) {
            var newAdjustment = self.stringTimeToTime(self.firstRunnerNewAdjustment);
            if (self.firstRunnerAdjustmentDirection === 'remove') {
                newAdjustment = Math.abs(newAdjustment) * -1;
            } else {
                newAdjustment = Math.abs(newAdjustment);
            }
            // Update the total adjustments.
            self.firstRunnerAdjustments += newAdjustment;
            self.firstRunnerNewAdjustment = '';
        } else {
            var newAdjustment = self.stringTimeToTime(self.secondRunnerNewAdjustment);
            if (self.secondRunnerAdjustmentDirection === 'remove') {
                newAdjustment = Math.abs(newAdjustment) * -1;
            } else {
                newAdjustment = Math.abs(newAdjustment);
            }
            // Update the total adjustments.
            self.secondRunnerAdjustments += newAdjustment;
            self.secondRunnerNewAdjustment = '';
        }
        self.recalculateLead();
    }

    self.recalculateLead = function recalculateLead() {
        self.latestCommonSplit = -1;
        var previousDelta = 0;
        var firstRunnerTime = 0;
        var secondRunnerTime = 0;
        var firstRunnerRecordForIl = true;
        var secondRunnerRecordForIl = true;
        for (var i = 0; i < this.splitsList.length; i++) {
            var firstTime = self.firstRunnerSplits[i].time;
            var secondTime = self.secondRunnerSplits[i].time;
            // We set the current cumulative time. If we're timing by using
            // individual level times, this is the sum of all times so far.
            // Otherwise, it's exactly the same as the splits.
            //
            // Also, if we are in the IL timing method, as soon as we see an
            // unpopulated split, stop adding up cumulative times. These will
            // not work with any missing splits.
            if (this.timingMethod === 'igt_il') {
                if (firstTime !== undefined) {
                    firstRunnerTime += firstTime;
                    if (firstRunnerRecordForIl) {
                        this.firstRunnerCumulativeTimes[i].time = firstRunnerTime;
                    }
                } else {
                    firstRunnerRecordForIl = false;
                }
                if (secondTime !== undefined) {
                    secondRunnerTime += secondTime;
                    if (secondRunnerRecordForIl) {
                        this.secondRunnerCumulativeTimes[i].time = secondRunnerTime;
                    }
                } else {
                    secondRunnerRecordForIl = false;
                }
            } else {
                firstRunnerTime = self.firstRunnerSplits[i].time;
                secondRunnerTime = self.secondRunnerSplits[i].time;
                this.firstRunnerCumulativeTimes[i].time = firstRunnerTime;
                this.secondRunnerCumulativeTimes[i].time = secondRunnerTime;
            }

            // Only calculate a difference for this split if both runners have
            // populated data for this split.
            if (this.firstRunnerCumulativeTimes[i].time !== undefined
                && this.secondRunnerCumulativeTimes[i].time !== undefined) {
                var firstSplitTime = firstRunnerTime;
                var secondSplitTime = secondRunnerTime;

                // This is the point where we add time adjustments.
                firstSplitTime += self.firstRunnerAdjustments;
                secondSplitTime += self.secondRunnerAdjustments;

                self.latestCommonSplit = i;

                var diffTime = firstSplitTime - secondSplitTime;
                var gain = diffTime - previousDelta;
                // If the gain is positive, then the delta has become larger,
                // and runner 2 has gained time. A negative delta favors
                // player 1 (as smaller times are better).
                var gainingRunner = -1;
                if (gain > 0) {
                    gainingRunner = 1;
                } else if (gain < 0) {
                    gainingRunner = 0;
                }
                // We save this as a non-absolute value, in order to make sure the
                // gains are correct.
                previousDelta = diffTime;
                // For display purposes, we want these to be absolute values from
                // here on out.
                diffTime = Math.abs(diffTime);
                gain = Math.abs(gain);

                self.timeDifference = diffTime;
                self.timeDifferenceString = self.timeToStringTimeWithFullText(diffTime);
                var leadingRunner = -1;
                if (firstSplitTime < secondSplitTime) {
                    leadingRunner = 0;
                } else if (secondSplitTime < firstSplitTime) {
                    leadingRunner = 1;
                }
                self.leadingRunner = leadingRunner;

                self.deltas[i] = {
                    leader: leadingRunner,
                    timeDelta: diffTime,
                    gain: gain,
                    gainingRunner: gainingRunner
                };
            }
        }

        // At the end of this, timeDifference, timeDifferenceString, and leadingRunner
        // will all be set appropriately.
        if (self.latestCommonSplit >= self.splitsList.length - 1) {
            self.raceComplete = true;
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

    self.timeToStringTime = function timeToStringTime(numTimeRaw) {
        var isNegative = numTimeRaw < 0;
        var negativeSign = isNegative ? '-' : '';
        numTime = Math.abs(numTimeRaw);

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
            return `${negativeSign}${secondsStr}`;
        }

        if (secondsStr.indexOf('.') <= 1) {
            secondsStr = `0${secondsStr}`;
        }
        if (hours == 0) {
            return `${negativeSign}${minutes.toString()}:${secondsStr}`;
        }

        if (minutes < 10) {
            minutesStr = `0${minutesStr}`;
        }

        return `${negativeSign}${hours.toString()}:${minutesStr}:${secondsStr}`;
    };

    self.timeToStringTimeWithFullText = function timeToStringTimeWithFullText(numTimeRaw) {
        var baseStringTime = this.timeToStringTime(numTimeRaw);

        // If we're doing approximate times, remove trailing zeroes from the decimal part.
        if (this.timingMethod === 'rta') {
            while (baseStringTime.charAt(baseStringTime.length - 1) === '0') {
                baseStringTime = baseStringTime.slice(0, -1);
            }
            // If we removed the entire decimal part, remove the decimal point.
            if (baseStringTime.charAt(baseStringTime.length - 1) === '.') {
                baseStringTime = baseStringTime.slice(0, -1);
            }
        }

        var secondsText = baseStringTime === '1' ? 'second' : 'seconds';
        return baseStringTime.indexOf(':') >= 0 ? baseStringTime : `${baseStringTime} ${secondsText}`;
    }

    self.getRunnerName = function getRunnerName(runner) {
        if (runner === 0) {
            return self.firstRunnerName;
        }
        if (runner === 1) {
            return self.secondRunnerName;
        }
        return '-';
    }
    
    self.restart = function restart() {
        self.splitsList = [];
        self.firstRunnerSplits = [];
        self.secondRunnerSplits = [];
        self.firstRunnerCumulativeTimes = [];
        self.secondRunnerCumulativeTimes = [];
        self.timingMethod = 'igt_cumulative';
        self.latestCommonSplit = -1;
        self.leadingRunner = -1;
        self.deltas = [];
        self.timeDifference = -1;
        self.timeDifferenceString = '';
        self.firstSplitSelect = '0';
        self.secondSplitSelect = '0';
        self.firstRunnerNewSplitTime = '';
        self.secondRunnerNewSplitTime = '';
        self.firstRunnerAdjustments = 0;
        self.secondRunnerAdjustments = 0;
        self.firstRunnerAdjustmentDirection = 'add';
        self.secondRunnerAdjustmentDirection = 'add';
        self.firstRunnerNewAdjustment = '';
        self.secondRunnerNewAdjustment = '';
        self.raceComplete = false;
        self.displayedTab = 'splits';
    };
};
