var comparatorCtrl = function comparatorCtrl($http) {
    let self = this;

    self.displayedTab = 'splits';
    self.splitTextContents = '';
    self.splitsList = [];
    self.timingMethod = 'cumulative';
    self.approximate = false;
    self.showSplitCounter = true;

    self.multilap = false;
    self.numLaps = 1;
    self.flatSplitsList = [];
    self.splitsPerLap = -1;

    self.firstRunnerName = '';
    self.secondRunnerName = '';
    self.firstRunnerSplits = [];
    self.secondRunnerSplits = [];
    self.firstRunnerLapTimes = [];
    self.secondRunnerLapTimes = [];

    self.firstSplitSelect = '0';
    self.secondSplitSelect = '0';
    self.firstRunnerNewSplitTime = '';
    self.secondRunnerNewSplitTime = '';

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

    self.displayCalculator = false;
    self.operand1 = '';
    self.operand2 = '';
    self.operator = '+';
    self.calculatorResult = '';

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
    self.timeRegex = /^(?:(?<hour>\d+):(?<hmin>[0-5]\d):(?<hsec>[0-5]\d(?:[\.,]\d+)?)|(?<min>[0-5]?\d):(?<msec>[0-5]\d(?:[\.,]\d+)?)|(?<sec>[0-5]?\d(?:[\.,]\d+)?))$/;

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
        // A quick failsafe.
        if (!self.multilap) {
            self.numLaps = 1;
        }

        let parsedList = self.splitTextContents.split('\n');

        if (parsedList.length <= 0 || !self.firstRunnerName || !self.secondRunnerName) {
            return;
        }

        // Create a list of split names, and also initialize the splits arrays.
        // We'll do this once per lap.
        for (let lap = 0; lap < self.numLaps; lap++) {
            let lapSplitList = [];
            let lapFirstRunnerSplits = [];
            let lapSecondRunnerSplits = [];
            let lapDeltas = [];
            for (let parsedSplit of parsedList) {
                if (parsedSplit) {
                    let splitName = parsedSplit;
                    if (self.multilap) {
                        splitName = `${parsedSplit} (${lap+1})`;
                    }
                    self.flatSplitsList.push(splitName);
                    lapSplitList.push(splitName);
                    lapFirstRunnerSplits.push(self.newSplitItem(splitName));
                    lapSecondRunnerSplits.push(self.newSplitItem(splitName));
                    lapDeltas.push({
                        leader: undefined,
                        timeDelta: undefined,
                        gain: undefined,
                        gainingRunner: undefined
                    });
                }
            }
            self.splitsList.push(lapSplitList);
            self.firstRunnerSplits.push(lapFirstRunnerSplits);
            self.secondRunnerSplits.push(lapSecondRunnerSplits);
            self.firstRunnerLapTimes.push(undefined);
            self.secondRunnerLapTimes.push(undefined);
            self.deltas.push(lapDeltas);
        }

        self.splitsPerLap = self.splitsList[0].length;

        self.displayedTab = 'data-entry';
    };

    self.newSplitItem = function newSplitItem(splitName) {
        return {
            name: splitName,
            splitTime: undefined,
            cumulativeTime: undefined,
            cumulativeTimeInLap: undefined,
            adjustment: 0,
            cumulativeAdjustment: 0
        };
    };

    self.addSplitTime = function addSplitTime(index) {
        if (index == 0) {
            let newTime = self.stringTimeToTimeRegex(self.firstRunnerNewSplitTime);
            if (newTime === null) {
                return;
            }
            let splitIndex = parseInt(self.firstSplitSelect);
            let chosenSplit = self.getLapAndSplitFromIndex(splitIndex);
            if (self.timingMethod === 'cumulative') {
                self.firstRunnerSplits[chosenSplit.lap][chosenSplit.split].cumulativeTimeInLap = newTime;
            } else {
                self.firstRunnerSplits[chosenSplit.lap][chosenSplit.split].splitTime = newTime;
            }
            // Update the select box, and erase the input.
            if (splitIndex < self.flatSplitsList.length - 1) {
                self.firstSplitSelect = (splitIndex + 1).toString();
            }
            self.firstRunnerNewSplitTime = '';
        } else {
            let newTime = self.stringTimeToTimeRegex(self.secondRunnerNewSplitTime);
            if (newTime === null) {
                return;
            }
            let splitIndex = parseInt(self.secondSplitSelect);
            let chosenSplit = self.getLapAndSplitFromIndex(splitIndex);
            if (self.timingMethod === 'cumulative') {
                self.secondRunnerSplits[chosenSplit.lap][chosenSplit.split].cumulativeTimeInLap = newTime;
            } else {
                self.secondRunnerSplits[chosenSplit.lap][chosenSplit.split].splitTime = newTime;
            }
            // Update the select box, and erase the input.
            if (splitIndex < self.flatSplitsList.length - 1) {
                self.secondSplitSelect = (splitIndex + 1).toString();
            }
            self.secondRunnerNewSplitTime = '';
        }
        self.recalculateTimes();
    };

    self.addAdjustment = function addAdjustment(index) {
        if (index == 0) {
            let newAdjustment = self.stringTimeToTimeRegex(self.firstRunnerNewAdjustment);
            if (newAdjustment === null) {
                return;
            }
            if (self.firstRunnerAdjustmentDirection === 'remove') {
                newAdjustment = Math.abs(newAdjustment) * -1;
            } else {
                newAdjustment = Math.abs(newAdjustment);
            }
            // Update the adjustment for this split.
            let splitIndex = parseInt(self.firstSplitSelect);
            let currentSplit = self.getLapAndSplitFromIndex(splitIndex);
            self.firstRunnerSplits[currentSplit.lap][currentSplit.split].adjustment += newAdjustment;
            self.firstRunnerNewAdjustment = '';
        } else {
            let newAdjustment = self.stringTimeToTimeRegex(self.secondRunnerNewAdjustment);
            if (newAdjustment === null) {
                return;
            }
            if (self.secondRunnerAdjustmentDirection === 'remove') {
                newAdjustment = Math.abs(newAdjustment) * -1;
            } else {
                newAdjustment = Math.abs(newAdjustment);
            }
            // Update the adjustment for this split.
            let splitIndex = parseInt(self.secondSplitSelect);
            let currentSplit = self.getLapAndSplitFromIndex(splitIndex);
            self.secondRunnerSplits[currentSplit.lap][currentSplit.split].adjustment += newAdjustment;
            self.secondRunnerNewAdjustment = '';
        }
        self.recalculateTimes();
    };

    self.getLapAndSplitFromIndex = function getLapAndSplitFromIndex(index) {
        if (!self.multilap || self.numLaps === 1) {
            return {lap: 0, split: index};
        }
        return {
            lap: Math.floor(index / self.splitsPerLap),
            split: index % self.splitsPerLap
        };
    };

    self.recalculateTimes = function recalculateTimes() {
        let firstRunnerRecordForIl = true;
        let secondRunnerRecordForIl = true;
        let firstRunnerCumulativeLaps = 0;
        let secondRunnerCumulativeLaps = 0;
        let firstRunnerCumulativeAdjustments = 0;
        let secondRunnerCumulativeAdjustments = 0;
        for (let lap = 0; lap < self.numLaps; lap++) {
            let firstRunnerLapCumulative = 0;
            let secondRunnerLapCumulative = 0;
            for (let i = 0; i < this.splitsPerLap; i++) {
                let firstSplit = self.firstRunnerSplits[lap][i];
                let secondSplit = self.secondRunnerSplits[lap][i];

                // The timing method we use determines what splits need to be
                // calculated and which are hard data.
                if (self.timingMethod === 'cumulative') {
                    // For the first split, the split time and cumulative time
                    // are the same.
                    if (i === 0 && lap === 0) {
                        firstSplit.splitTime = firstSplit.cumulativeTimeInLap;
                        secondSplit.splitTime = secondSplit.cumulativeTimeInLap;
                    } else {
                        let firstPreviousSplit;
                        let secondPreviousSplit;
                        if (i === 0) {
                            firstPreviousSplit = self.firstRunnerSplits[lap-1][self.splitsPerLap-1];
                            secondPreviousSplit = self.secondRunnerSplits[lap-1][self.splitsPerLap-1];
                        } else {
                            firstPreviousSplit = self.firstRunnerSplits[lap][i-1];
                            secondPreviousSplit = self.secondRunnerSplits[lap][i-1];
                        }

                        // If this is the first split in the lap, the split
                        // time is the cumulative time in the lap so far.
                        if (i === 0) {
                            firstSplit.splitTime = firstSplit.cumulativeTimeInLap;
                            secondSplit.splitTime = secondSplit.cumulativeTimeInLap;
                        } else {
                            // If this split is present, and the last split is present,
                            // calculate the individual split time. We can do this
                            // throughout the whole set of splits, no matter how many
                            // cumulative times are present.
                            if (firstSplit.cumulativeTimeInLap !== undefined
                                && firstPreviousSplit.cumulativeTimeInLap !== undefined) {
                                firstSplit.splitTime = firstSplit.cumulativeTimeInLap - firstPreviousSplit.cumulativeTimeInLap;
                            }
                            if (secondSplit.cumulativeTimeInLap !== undefined
                                && secondPreviousSplit.cumulativeTimeInLap !== undefined) {
                                secondSplit.splitTime = secondSplit.cumulativeTimeInLap - secondPreviousSplit.cumulativeTimeInLap;
                            }
                        }
                    }
                    // Set the cumulative overall time, across all laps.
                    if (firstSplit.cumulativeTimeInLap !== undefined) {
                        firstSplit.cumulativeTime = firstSplit.cumulativeTimeInLap + firstRunnerCumulativeLaps;
                    }
                    if (secondSplit.cumulativeTimeInLap !== undefined) {
                        secondSplit.cumulativeTime = secondSplit.cumulativeTimeInLap + secondRunnerCumulativeLaps;
                    }
                } else {
                    // For the first split, the split time and cumulative time
                    // are the same.
                    if (i === 0 && lap === 0) {
                        firstSplit.cumulativeTime = firstSplit.splitTime;
                        firstSplit.cumulativeTimeInLap = firstSplit.splitTime;
                        firstRunnerLapCumulative = firstSplit.cumulativeTimeInLap !== undefined
                            ? firstSplit.cumulativeTimeInLap
                            : 0;
                        secondSplit.cumulativeTime = secondSplit.splitTime;
                        secondSplit.cumulativeTimeInLap = secondSplit.splitTime;
                        secondRunnerLapCumulative = secondSplit.cumulativeTimeInLap !== undefined
                            ? secondSplit.cumulativeTimeInLap
                            : 0;
                    } else {
                        // We determine cumulative times up until we find a single
                        // unpopulated split. At that point, we stop.
                        if (firstSplit.splitTime !== undefined) {
                            firstRunnerLapCumulative += firstSplit.splitTime;
                            if (firstRunnerRecordForIl) {
                                firstSplit.cumulativeTimeInLap = firstRunnerLapCumulative;
                                firstSplit.cumulativeTime = firstRunnerLapCumulative + firstRunnerCumulativeLaps;
                            }
                        } else {
                            firstRunnerRecordForIl = false;
                        }
                        if (secondSplit.splitTime !== undefined) {
                            secondRunnerLapCumulative += secondSplit.splitTime;
                            if (secondRunnerRecordForIl) {
                                secondSplit.cumulativeTimeInLap = secondRunnerLapCumulative;
                                secondSplit.cumulativeTime = secondRunnerLapCumulative + secondRunnerCumulativeLaps;
                            }
                        } else {
                            secondRunnerRecordForIl = false;
                        }
                    }
                }
                
                // Lastly, determine cumulative adjustments.
                firstRunnerCumulativeAdjustments += firstSplit.adjustment;
                firstSplit.cumulativeAdjustment = firstRunnerCumulativeAdjustments;
                secondRunnerCumulativeAdjustments += secondSplit.adjustment;
                secondSplit.cumulativeAdjustment = secondRunnerCumulativeAdjustments;
            }

            // Add in lap times here. If the last split of this lap is
            // populated, we're safe to add a lap time.
            let firstRunnerLapTime = self.firstRunnerSplits[lap][this.splitsPerLap-1].cumulativeTimeInLap;
            if (firstRunnerLapTime !== undefined) {
                self.firstRunnerLapTimes[lap] = firstRunnerLapTime;
                firstRunnerCumulativeLaps += firstRunnerLapTime;
            }
            let secondRunnerLapTime = self.secondRunnerSplits[lap][this.splitsPerLap-1].cumulativeTimeInLap;
            if (secondRunnerLapTime !== undefined) {
                self.secondRunnerLapTimes[lap] = secondRunnerLapTime;
                secondRunnerCumulativeLaps += secondRunnerLapTime;
            }
        }
        self.recalculateLead();
    };

    self.recalculateLead = function recalculateLead() {
        self.latestCommonSplit = {lap: -1, split: -1};
        let previousDelta = 0;
        for (let lap = 0; lap < this.numLaps; lap++) {
            for (let i = 0; i < this.splitsPerLap; i++) {
                // Only calculate a difference for this split if both runners have
                // populated data for this split.
                if (this.firstRunnerSplits[lap][i].cumulativeTime !== undefined
                    && this.secondRunnerSplits[lap][i].cumulativeTime !== undefined) {
                    let firstSplitTime = this.firstRunnerSplits[lap][i].cumulativeTime;
                    let secondSplitTime = this.secondRunnerSplits[lap][i].cumulativeTime;

                    // This is the point where we add time adjustments.
                    firstSplitTime += this.firstRunnerSplits[lap][i].cumulativeAdjustment;
                    secondSplitTime += this.secondRunnerSplits[lap][i].cumulativeAdjustment;

                    self.latestCommonSplit = {lap, split: i};

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

                    self.deltas[lap][i] = {
                        leader: leadingRunner,
                        timeDelta: diffTime,
                        gain: gain,
                        gainingRunner: gainingRunner
                    };
                }
            }
        }
        // At the end of this, timeDifference, timeDifferenceString, and leadingRunner
        // will all be set appropriately.
    };

    self.getSplitCounter = function getSplitCounter() {
        let currentSplit = 0;
        if (this.commonSplitExists()) {
            currentSplit = (self.latestCommonSplit.lap * self.splitsPerLap)
                + self.latestCommonSplit.split + 1;
        }
        let totalSplits = self.numLaps * self.splitsPerLap;
        return `(Split ${currentSplit}/${totalSplits})`;
    };

    self.commonSplitExists = function commonSplitExists() {
        return self.latestCommonSplit.lap >= 0
            && self.latestCommonSplit.split >= 0;
    };

    self.raceComplete = function raceComplete() {
        return self.latestCommonSplit.lap >= (self.numLaps - 1)
            && self.latestCommonSplit.split >= (self.splitsPerLap - 1);
    };

    self.getTotalRaceTime = function getTotalRaceTime(runnerIndex) {
        if (runnerIndex === 0) {
            let finalSplit = self.firstRunnerSplits[self.numLaps - 1][self.splitsPerLap - 1];
            if (finalSplit !== undefined) {
                return finalSplit.cumulativeTime;
            }
        } else {
            let finalSplit = self.secondRunnerSplits[self.numLaps - 1][self.splitsPerLap - 1];
            if (finalSplit !== undefined) {
                return finalSplit.cumulativeTime;
            }
        }

        return undefined;
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

    self.stringTimeToTimeRegex = function stringTimeToTimeRegex(strTime) {
        let matches = self.timeRegex.exec(strTime);
        if (matches === null) {
            return null;
        }

        let hours = 0;
        let minutes = 0;
        // Seconds includes milliseconds as well.
        let seconds = 0;
        if (matches.groups?.hour !== undefined) {
            hours = parseInt(matches.groups.hour);
            minutes = parseInt(matches.groups.hmin);
            seconds = parseFloat(matches.groups.hsec);
        } else if (matches.groups?.min !== undefined) {
            minutes = parseInt(matches.groups.min);
            seconds = parseFloat(matches.groups.msec);
        } else {
            seconds = parseFloat(matches.groups.sec);
        }
        return (3600 * hours) + (60 * minutes) + seconds;
    };

    self.timeToStringTime = function timeToStringTime(numTimeRaw) {
        if (numTimeRaw === undefined) {
            return '-';
        }

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

    self.getRunnerSplit = function getRunnerSplit(runner) {
        if (runner === 0) {
            let splitIndex = parseInt(self.firstSplitSelect);
            let currentSplit = self.getLapAndSplitFromIndex(splitIndex);
            return self.splitsList[currentSplit.lap][currentSplit.split];
        }
        if (runner === 1) {
            let splitIndex = parseInt(self.secondSplitSelect);
            let currentSplit = self.getLapAndSplitFromIndex(splitIndex);
            return self.splitsList[currentSplit.lap][currentSplit.split];
        }
        return '-';
    }

    self.selectTimeText = function selectTimeText() {
        const input = document.getElementById('timeText');
        window.getSelection().selectAllChildren(input);
        navigator.clipboard.writeText(input.innerText);
    };

    self.selectGainText = function selectGainText(lapIdx, idx) {
        const delta = self.deltas[lapIdx][idx];
        if (delta.gain === 0) {
            return;
        }

        const textElement = document.getElementById('gainText' + lapIdx + '_' + idx);
        window.getSelection().selectAllChildren(textElement);

        const gainText = `${self.getRunnerName(delta.gainingRunner)} ` +
                         `gains ${self.timeToStringTimeWithFullText(delta.gain)} ` +
                         `in ${self.splitsList[lapIdx][idx]}`;
        navigator.clipboard.writeText(gainText);
    };

    self.toggleCalculator = function toggleCalculator() {
        self.displayCalculator = !self.displayCalculator;
    };

    // operand1 and operand2 are both strings representing time.
    self.timeCalculatorFunction = function timeCalculatorFunction() {
        let time1 = self.stringTimeToTimeRegex(self.operand1);
        let time2 = self.stringTimeToTimeRegex(self.operand2);
        if (time1 === null || time2 === null) {
            return;
        }

        let result = self.operator === '+' ? time1 + time2 : time1 - time2;
        self.calculatorResult = self.timeToStringTime(result);
    };

    self.exportToCsv = function exportToCsv() {
        let csvString = `${self.getRunnerName(0)},,,,,,,,,,${self.getRunnerName(1)},,,\n`;
        csvString += 'Split Name,IL Time,Adjustments,Cumulative Time,,';
        csvString += 'Leader,Difference,Gaining Runner,Gain,,';
        csvString += 'Split Name,IL Time,Adjustments,Cumulative Time\n';

        for (let lap = 0; lap < self.numLaps; lap++) {
            for (let i = 0; i < self.splitsPerLap; i++) {
                let firstRunnerSplit = self.firstRunnerSplits[lap][i];
                let secondRunnerSplit = self.secondRunnerSplits[lap][i];
                let delta = self.deltas[lap][i];

                // First runner data.
                csvString += `${self.splitsList[lap][i]},`;
                if (firstRunnerSplit.splitTime !== undefined) {
                    csvString += `${self.timeToStringTime(firstRunnerSplit.splitTime)},`;
                } else {
                    csvString += '-,';
                }
                csvString += `${self.timeToStringTime(firstRunnerSplit.adjustment)},`;
                if (firstRunnerSplit.cumulativeTime !== undefined) {
                    let totalTime = firstRunnerSplit.cumulativeTime + firstRunnerSplit.cumulativeAdjustment;
                    csvString += `${self.timeToStringTime(totalTime)},`;
                } else {
                    csvString += '-,';
                }
                csvString += ',';

                // Deltas.
                csvString += `${self.getRunnerName(delta.leader)},`;
                if (delta.timeDelta !== undefined) {
                    csvString += `${self.timeToStringTime(delta.timeDelta)},`;
                } else {
                    csvString += '-,';
                }
                if (delta.gain) {
                    csvString += `${self.getRunnerName(delta.gainingRunner)},` +
                                `${self.timeToStringTime(delta.gain)},`;
                } else {
                    csvString += '-,-,';
                }
                csvString += ',';

                // Second runner data.
                csvString += `${self.splitsList[lap][i]},`;
                if (secondRunnerSplit.splitTime !== undefined) {
                    csvString += `${self.timeToStringTime(secondRunnerSplit.splitTime)},`;
                } else {
                    csvString += '-,';
                }
                csvString += `${self.timeToStringTime(secondRunnerSplit.adjustment)},`;
                if (secondRunnerSplit.cumulativeTime !== undefined) {
                    let totalTime = secondRunnerSplit.cumulativeTime + secondRunnerSplit.cumulativeAdjustment;
                    csvString += `${self.timeToStringTime(totalTime)}`;
                } else {
                    csvString += '-';
                }
                csvString += '\n';
            }
            if (self.multilap) {
                // Lap data, player 1.
                csvString += `Lap ${lap+1} time,,,`;
                csvString += `${self.timeToStringTime(self.firstRunnerLapTimes[lap])},`;
                // Gap (to be filled in with lap deltas).
                csvString += ',,,,,,';
                // Lap data, player 2.
                csvString += `Lap ${lap+1} time,,,`;
                csvString += `${self.timeToStringTime(self.secondRunnerLapTimes[lap])}`;
                csvString += '\n';
            }
        }
        if (self.multilap) {
            // Total time, player 1.
            csvString += 'Total time,,,';
            csvString += `${self.timeToStringTime(self.getTotalRaceTime(0))},,,,,,,`;
            // Total time, player 2.
            csvString += 'Total time,,,';
            csvString += `${self.timeToStringTime(self.getTotalRaceTime(1))}`;
            csvString += '\n';
        }

        self.downloadCsv(csvString);
    };

    self.downloadCsv = function downloadCsv(csvString) {
        // Create the file.
        const file = new File([csvString], 'race_data.csv', {
            type: "text/csv"
        });

        // Create a link that holds the file, and auto-click it.
        const link = document.createElement('a');
        const url = URL.createObjectURL(file);
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();

        // Delete the link.
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };
    
    self.restart = function restart() {
        self.splitsList = [];
        self.flatSplitsList = [];
        self.splitsPerLap = -1;
        self.firstRunnerSplits = [];
        self.secondRunnerSplits = [];
        self.firstRunnerLapTimes = [];
        self.secondRunnerLapTimes = [];
        self.latestCommonSplit = -1;
        self.leadingRunner = -1;
        self.deltas = [];
        self.timeDifference = -1;
        self.timeDifferenceString = '';
        self.firstSplitSelect = '0';
        self.secondSplitSelect = '0';
        self.firstRunnerNewSplitTime = '';
        self.secondRunnerNewSplitTime = '';
        self.firstRunnerAdjustmentDirection = 'add';
        self.secondRunnerAdjustmentDirection = 'add';
        self.firstRunnerNewAdjustment = '';
        self.secondRunnerNewAdjustment = '';
        self.raceComplete = false;
        self.displayedTab = 'splits';
    };
};
