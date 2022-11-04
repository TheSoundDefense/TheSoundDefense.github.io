var comparatorCtrl = function comparatorCtrl($http) {
    let self = this;

    self.displayedTab = 'splits';
    self.splitTextContents = '';
    self.splitsList = [];
    self.timingMethod = 'cumulative';
    self.approximate = false;

    self.firstRunnerName = '';
    self.secondRunnerName = '';
    self.firstRunnerSplits = [];
    self.secondRunnerSplits = [];

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
        for (let game of games) {
            for (let category of game.categories) {
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

        let selectedSplits = self.predefinedSplits[parseInt(self.predefinedSplitSelect)];
        let splitString = '';
        for (let split of selectedSplits.splits) {
            splitString += `${split}\n`;
        }
        self.splitTextContents = splitString;
    };

    self.begin = function begin() {
        let parsedList = self.splitTextContents.split('\n');

        if (parsedList.length <= 0 || !self.firstRunnerName || !self.secondRunnerName) {
            return;
        }

        // Create a list of split names, and also initialize the splits arrays.
        for (let parsedSplit of parsedList) {
            if (parsedSplit) {
                self.splitsList.push(parsedSplit);
                self.firstRunnerSplits.push(self.newSplitItem(parsedSplit));
                self.secondRunnerSplits.push(self.newSplitItem(parsedSplit));
                self.deltas.push({
                    leader: undefined,
                    timeDelta: undefined,
                    gain: undefined,
                    gainingRunner: undefined
                });
            }
        }

        self.displayedTab = 'data-entry';
    };

    self.newSplitItem = function newSplitItem(splitName) {
        return {
            name: splitName,
            splitTime: undefined,
            cumulativeTime: undefined
        };
    };

    self.addSplitTime = function addSplitTime(index) {
        if (index == 0) {
            let newTime = self.stringTimeToTime(self.firstRunnerNewSplitTime);
            let chosenSplit = parseInt(self.firstSplitSelect);
            if (self.timingMethod === 'cumulative') {
                self.firstRunnerSplits[chosenSplit].cumulativeTime = newTime;
            } else {
                self.firstRunnerSplits[chosenSplit].splitTime = newTime;
            }
            // Update the select box, and erase the input.
            if (chosenSplit < self.splitsList.length - 1) {
                self.firstSplitSelect = (chosenSplit + 1).toString();
            }
            self.firstRunnerNewSplitTime = '';
        } else {
            let newTime = self.stringTimeToTime(self.secondRunnerNewSplitTime);
            let chosenSplit = parseInt(self.secondSplitSelect);
            if (self.timingMethod === 'cumulative') {
                self.secondRunnerSplits[chosenSplit].cumulativeTime = newTime;
            } else {
                self.secondRunnerSplits[chosenSplit].splitTime = newTime;
            }
            // Update the select box, and erase the input.
            if (chosenSplit < self.splitsList.length - 1) {
                self.secondSplitSelect = (chosenSplit + 1).toString();
            }
            self.secondRunnerNewSplitTime = '';
        }
        self.recalculateTimes();
    };

    self.addAdjustment = function addAdjustment(index) {
        if (index == 0) {
            let newAdjustment = self.stringTimeToTime(self.firstRunnerNewAdjustment);
            if (self.firstRunnerAdjustmentDirection === 'remove') {
                newAdjustment = Math.abs(newAdjustment) * -1;
            } else {
                newAdjustment = Math.abs(newAdjustment);
            }
            // Update the total adjustments.
            self.firstRunnerAdjustments += newAdjustment;
            self.firstRunnerNewAdjustment = '';
        } else {
            let newAdjustment = self.stringTimeToTime(self.secondRunnerNewAdjustment);
            if (self.secondRunnerAdjustmentDirection === 'remove') {
                newAdjustment = Math.abs(newAdjustment) * -1;
            } else {
                newAdjustment = Math.abs(newAdjustment);
            }
            // Update the total adjustments.
            self.secondRunnerAdjustments += newAdjustment;
            self.secondRunnerNewAdjustment = '';
        }
        self.recalculateTimes();
    }

    self.recalculateTimes = function recalculateTimes() {
        let firstRunnerCumulative = 0;
        let secondRunnerCumulative = 0;
        let firstRunnerRecordForIl = true;
        let secondRunnerRecordForIl = true;
        for (let i = 0; i < this.splitsList.length; i++) {
            // The timing method we use determines what splits need to be
            // calculated and which are hard data.
            if (self.timingMethod === 'cumulative') {
                let firstSplit = self.firstRunnerSplits[i];
                let secondSplit = self.secondRunnerSplits[i];
                // For the first split, the split time and cumulative time
                // are the same.
                if (i === 0) {
                    firstSplit.splitTime = firstSplit.cumulativeTime;
                    secondSplit.splitTime = secondSplit.cumulativeTime;
                } else {
                    let firstPreviousSplit = self.firstRunnerSplits[i-1];
                    let secondPreviousSplit = self.secondRunnerSplits[i-1];
                    // If this split is present, and the last split is present,
                    // calculate the individual split time. We can do this
                    // throughout the whole set of splits, no matter how many
                    // cumulative times are present.
                    if (firstSplit.cumulativeTime !== undefined
                        && firstPreviousSplit.cumulativeTime !== undefined) {
                        firstSplit.splitTime = firstSplit.cumulativeTime - firstPreviousSplit.cumulativeTime;
                    }
                    if (secondSplit.cumulativeTime !== undefined
                        && secondPreviousSplit.cumulativeTime !== undefined) {
                        secondSplit.splitTime = secondSplit.cumulativeTime - secondPreviousSplit.cumulativeTime;
                    }
                }
            } else {
                let firstSplit = self.firstRunnerSplits[i];
                let secondSplit = self.secondRunnerSplits[i];
                // For the first split, the split time and cumulative time
                // are the same.
                if (i === 0) {
                    firstSplit.cumulativeTime = firstSplit.splitTime;
                    firstRunnerCumulative = firstSplit.cumulativeTime !== undefined
                        ? firstSplit.cumulativeTime
                        : 0;
                    secondSplit.cumulativeTime = secondSplit.splitTime;
                    secondRunnerCumulative = secondSplit.cumulativeTime !== undefined
                        ? secondSplit.cumulativeTime
                        : 0;
                } else {
                    // We determine cumulative times up until we find a single
                    // unpopulated split. At that point, we stop.
                    if (firstSplit.splitTime !== undefined) {
                        firstRunnerCumulative += firstSplit.splitTime;
                        if (firstRunnerRecordForIl) {
                            firstSplit.cumulativeTime = firstRunnerCumulative;
                        }
                    } else {
                        firstRunnerRecordForIl = false;
                    }
                    if (secondSplit.splitTime !== undefined) {
                        secondRunnerCumulative += secondSplit.splitTime;
                        if (secondRunnerRecordForIl) {
                            secondSplit.cumulativeTime = secondRunnerCumulative;
                        }
                    } else {
                        secondRunnerRecordForIl = false;
                    }
                }
            }
        }
        self.recalculateLead();
    }

    self.recalculateLead = function recalculateLead() {
        self.latestCommonSplit = -1;
        let previousDelta = 0;
        for (let i = 0; i < this.splitsList.length; i++) {
            // Only calculate a difference for this split if both runners have
            // populated data for this split.
            if (this.firstRunnerSplits[i].cumulativeTime !== undefined
                && this.secondRunnerSplits[i].cumulativeTime !== undefined) {
                let firstSplitTime = this.firstRunnerSplits[i].cumulativeTime;
                let secondSplitTime = this.secondRunnerSplits[i].cumulativeTime;

                // This is the point where we add time adjustments.
                firstSplitTime += self.firstRunnerAdjustments;
                secondSplitTime += self.secondRunnerAdjustments;

                self.latestCommonSplit = i;

                let diffTime = firstSplitTime - secondSplitTime;
                let gain = diffTime - previousDelta;
                // If the gain is positive, then the delta has become larger,
                // and runner 2 has gained time. A negative delta favors
                // player 1 (as smaller times are better).
                let gainingRunner = -1;
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
                let leadingRunner = -1;
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
        let parsedTime = strTime.split(':');
        if (parsedTime.length == 1) {
            return parseFloat(parsedTime[0]);
        }
        if (parsedTime.length == 2) {
            let minutes = parseInt(parsedTime[0]);
            let seconds = parseFloat(parsedTime[1]);
            return (minutes * 60) + seconds;
        }
        // We stop at hours.
        let hours = parseInt(parsedTime[0]);
        let minutes = parseInt(parsedTime[1]);
        let seconds = parseFloat(parsedTime[2]);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    self.timeToStringTime = function timeToStringTime(numTimeRaw) {
        let isNegative = numTimeRaw < 0;
        let negativeSign = isNegative ? '-' : '';
        numTime = Math.abs(numTimeRaw);

        let hours = 0;
        let timeWithoutHours = numTime;
        if (numTime >= 3600) {
            hours = Math.floor(numTime / 3600);
            timeWithoutHours = timeWithoutHours % 3600;
        }
        let minutes = Math.floor(timeWithoutHours / 60);
        let minutesStr = minutes.toString();
        let seconds = timeWithoutHours % 60;
        let secondsStr = seconds.toFixed(self.precision);
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
        let baseStringTime = this.timeToStringTime(numTimeRaw);

        // If we're doing approximate times, remove trailing zeroes from the decimal part.
        if (this.approximate) {
            while (baseStringTime.charAt(baseStringTime.length - 1) === '0') {
                baseStringTime = baseStringTime.slice(0, -1);
            }
            // If we removed the entire decimal part, remove the decimal point.
            if (baseStringTime.charAt(baseStringTime.length - 1) === '.') {
                baseStringTime = baseStringTime.slice(0, -1);
            }
        }

        let secondsText = baseStringTime === '1' ? 'second' : 'seconds';
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
