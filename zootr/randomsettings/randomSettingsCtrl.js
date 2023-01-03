var randomSettingsCtrl = function randomSettingsCtrl($http) {
    let self = this;

    self.allSettings = {};
    self.allWeights = {};
    // This object only exists for convenience. It makes lookups much easier.
    self.flatSettings = {};

    self.finalSettings = "";
    self.errorString = "";

    self.simpleSettings = true;
    self.criticalHintsOn = false;
    self.fullInstructionsVisible = false;

    // This function will restore locally stored settings, if possible. It returns
    // true if successful and false if not.
    self.restoreSettings = function restoreSettings() {
        if (localStorage.getItem('weights') === null) {
            return false;
        }
        self.allWeights = JSON.parse(localStorage.getItem('weights'));
        return true;
    };

    $http.get('settings_list.json').then(function(response) {
        self.allSettings = response.data;
    });

    //let settingsRestored = self.restoreSettings();

    // Apply default weights to all settings that don't already have them. Also
    // add all settings to our master object (which will make the data binding
    // much easier.)
    for (const category in self.allSettings) {
        for (const setting of self.allSettings[category]) {
            self.flatSettings[setting["name"]] = setting;

            //if (settingsRestored) continue;

            // Binary on/off settings get a straight 0.5 weight.
            if (setting["type"] === "binary") {
                if (setting["weight"] === undefined) {
                    setting["weight"] = 0.5;
                }
                self.allWeights[setting["name"]] = setting["weight"];
            }
            // Radio settings get a weight of 1 for each option.
            // Only one option can be chosen for each radio setting.
            if (setting["type"] === "radio") {
                let weightsObject = {};
                for (const option of setting["options"]) {
                    if (option["weight"] === undefined) {
                        option["weight"] = 1;
                    }
                    weightsObject[option["name"]] = option["weight"];
                }
                self.allWeights[setting["name"]] = weightsObject;
            }
            // Multi settings get a weight of 0.5 for each option.
            // Any combination of options can be chosen for multi settings.
            if (setting["type"] === "multi") {
                let weightsObject = {};
                for (const option of setting["options"]) {
                    if (option["weight"] === undefined) {
                        option["weight"] = 0.5;
                    }
                    weightsObject[option["name"]] = option["weight"];
                }
                self.allWeights[setting["name"]] = weightsObject;
            }
            // Numeric settings do not have weights per se. They instead
            // have min, max and mean.
            if (setting["type"] === "numeric") {
                self.allWeights[setting["name"]] = {
                    "distribution": setting["num_options"]["distribution"],
                    "min": setting["num_options"]["min"],
                    "max": setting["num_options"]["max"],
                    "mean": setting["num_options"]["mean"]
                };
            }
            // Handle special cases.
            if (setting["type"] === "special_case") {
                if (setting["name"] === "triforce_count_per_world") {
                    self.allWeights[setting["name"]] = {
                        "scale_min": setting["special_options"]["scale_min"],
                        "scale_max": setting["special_options"]["scale_max"]
                    };
                }
            }
        }
    }

    self.displayFullInstructions = function displayFullInstructions() {
        self.fullInstructionsVisible = true;
    };

    self.toggleHints = function toggleHints() {
        // When we toggle critical hints, we need to forcibly change the weights
        // for the Gossip Stones setting.
        if (self.criticalHintsOn) {
            self.allWeights["hints"]["none"] = 0;
            self.allWeights["hints"]["mask"] = 0;
            self.allWeights["hints"]["agony"] = 0;
            self.allWeights["hints"]["always"] = 1;
        } else {
            self.allWeights["hints"]["none"] = 1;
            self.allWeights["hints"]["mask"] = 1;
            self.allWeights["hints"]["agony"] = 1;
            self.allWeights["hints"]["always"] = 1;
        }
    };

    self.isInputDisabled = function isInputDisabled(setting) {
        return self.criticalHintsOn && setting["name"] === "hints";
    };

    self.isCategoryDisplayed = function isCategoryDisplayed(categoryName) {
        return (!self.simpleSettings ||
                (categoryName === "Open"
                 || categoryName === "World"
                 || categoryName === "Shuffle Dungeon Items"));
    }

    self.isSettingDisplayed = function isSettingDisplayed() {
        return function(setting) {
            return setting["simple_shuffle"] || !self.simpleSettings;
        };
    };

    // Returns true if this setting could possibly be included. If the setting
    // has a prerequisite that has zero weight, this setting cannot possibly
    // be included.
    self.isSettingPossible = function isSettingPossible(setting) {
        if (setting["prerequisite"] === undefined) {
            return true;
        }

        let possibleSetting = true;

        for (const prereq of setting["prerequisite"]) {
            // Skip over prerequisites with no values. Those are not relevant here.
            if (prereq["value"] === undefined) {
                continue;
            }

            const prereqSetting = self.getFullSetting(prereq["name"]);
            let prereqHasValidWeight = false;

            if (prereqSetting["type"] === "binary") {
                if (prereq["value"].includes(true) && self.allWeights[prereq["name"]] > 0) {
                    prereqHasValidWeight = true;
                } else if (prereq["value"].includes(false) && self.allWeights[prereq["name"]] < 1) {
                    prereqHasValidWeight = true;
                }
            } else if (prereqSetting["type"] === "radio" || prereqSetting["type"] === "multi") {
                for (const validValue of prereq["value"]) {
                    if (self.allWeights[prereq["name"]][validValue] > 0) {
                        prereqHasValidWeight = true;
                    }
                }
            }

            if (!prereqHasValidWeight) {
                possibleSetting = false;
            }
        }

        return possibleSetting;
    };

    self.isBinarySettingGuaranteed = function isBinarySettingGuaranteed(setting) {
        return self.allWeights[setting["name"]] === 1;
    };

    self.isRadioOptionGuaranteed = function isRadioOptionGuaranteed(setting, option) {
        // Check every option. If any options other than the one in question have a
        // non-zero weight, or if this one has a weight less than one, return false.
        const settingWeights = self.allWeights[setting["name"]];
        const currentOptionName = option["name"];

        for (const optionName in settingWeights) {
            if (optionName === currentOptionName && settingWeights[optionName] === 0) {
                return false;
            }
            if (optionName !== currentOptionName && settingWeights[optionName] !== 0) {
                return false;
            }
        }
        return true;
    };

    self.isMultiOptionGuaranteed = function isMultiOptionGuaranteed(setting, option) {
        return self.allWeights[setting["name"]][option["name"]] === 1;
    };

    self.isSettingWeightZero = function isSettingWeightZero(setting) {
        return self.allWeights[setting["name"]] === 0;
    };

    self.isOptionWeightZero = function isOptionWeightZero(setting, option) {
        return self.allWeights[setting["name"]][option["name"]] === 0;
    };

    // This function obtains the full setting, given the name.
    self.getFullSetting = function getFullSetting(settingName) {
        return self.flatSettings[settingName];
    };

    // This function ensures that all provided values are valid. If anything is
    // invalid, an error will be thrown.
    self.validateSettings = function validateSettings() {
        for (const category in self.allSettings) {
            for (const setting of self.allSettings[category]) {
                const weights = self.allWeights[setting["name"]];
                if (setting["type"] === "binary") {
                    if (self.allWeights[setting["name"]] === undefined) {
                        const errorMessage = `Invalid weight for setting "${setting["label"]}". \
                        Weight must be between 0 and 1.`;
                        throw new RangeError(errorMessage);
                    }
                }
                if (setting["type"] === "radio") {
                    let hasAnyPossibleOption = false;
                    for (const option of setting["options"]) {
                        const optionWeight = weights[option["name"]];
                        if (optionWeight === undefined) {
                            const errorMessage = `Invalid weight for option "${option["label"]}" in \
                            setting "${setting["label"]}". Weight must be greater than 0.`;
                            throw new RangeError(errorMessage);
                        }
                        if (optionWeight > 0) {
                            hasAnyPossibleOption = true;
                        }
                    }
                    if (!hasAnyPossibleOption) {
                        const errorMessage = `No possible options for setting "${setting["label"]}". \
                        At least one option needs a non-zero weight.`;
                        throw new RangeError(errorMessage);
                    }
                }
                if (setting["type"] === "multi") {
                    for (const option of setting["options"]) {
                        if (weights[option["name"]] === undefined) {
                            const errorMessage = `Invalid weight for option "${option["label"]}" in \
                            setting "${setting["label"]}". Weight must be between 0 and 1.`;
                            throw new RangeError(errorMessage);
                        }
                    }
                }
                if (setting["type"] === "numeric") {
                    const numOptions = self.flatSettings[setting["name"]]["num_options"];
                    if (weights["min"] === undefined) {
                        const errorMessage = `Invalid minimum value for setting "${setting["label"]}". \
                        Minimum must be between ${numOptions["min"]} and ${numOptions["max"]}.`;
                        throw new RangeError(errorMessage);
                    }
                    if (weights["max"] === undefined) {
                        const errorMessage = `Invalid maximum value for setting "${setting["label"]}". \
                        Maximum must be between ${numOptions["min"]} and ${numOptions["max"]}.`;
                        throw new RangeError(errorMessage);
                    }
                    if (weights["min"] > weights["max"]) {
                        const errorMessage = `Invalid range for setting "${setting["label"]}". \
                        The minimum cannot be larger than the maximum.`;
                        throw new RangeError(errorMessage);
                    }
                    if (weights["distribution"] === "gaussian" && weights["mean"] === undefined) {
                        const errorMessage = `Invalid average value for setting "${setting["label"]}". \
                        Average must be between ${weights["min"]} and ${weights["max"]}.`;
                        throw new RangeError(errorMessage);
                    }
                }
                if (setting["type"] === "special_case") {
                    if (setting["name"] === "triforce_count_per_world") {
                        if (weights["scale_min"] === undefined) {
                            const errorMessage = `Invalid minimum scale value for setting \
                            "${setting["label"]}". Minimum must be between 1 and 2.`;
                            throw new RangeError(errorMessage);
                        }
                        if (weights["scale_max"] === undefined) {
                            const errorMessage = `Invalid maximum scale value for setting \
                            "${setting["label"]}". Maximum must be between 1 and 2.`;
                            throw new RangeError(errorMessage);
                        }
                        if (weights["scale_min"] > weights["scale_max"]) {
                            const errorMessage = `Invalid range for setting "${setting["label"]}". \
                            The minimum cannot be larger than the maximum.`;
                            throw new RangeError(errorMessage);
                        }
                    }
                }
            }
        }
    };

    self.randomizeSetting = function randomizeSetting(setting, conflictingSettings) {
        // If we are in simple settings mode, and this is not a simplpe setting,
        // just use the default value.
        if (self.simpleSettings && setting["simple_shuffle"] === false) {
            return setting["default_value"];
        }

        if (setting["type"] === "binary") {
            return self.randomizeBinarySetting(setting);
        }
        if (setting["type"] === "radio") {
            return self.randomizeRadioSetting(setting, conflictingSettings);
        }
        if (setting["type"] === "multi") {
            return self.randomizeMultiSetting(setting);
        }
        if (setting["type"] === "numeric") {
            return self.randomizeNumericSetting(setting);
        }

        // No idea how we get here.
        return undefined;
    };

    self.randomizeBinarySetting = function randomizeBinarySetting(setting) {
        // If the random number is greater than or equal to the weight, the
        // setting becomes false. (Higher weights = more likely.) The random
        // number will never be lower than 0 or equal to 1.
        return Math.random() < self.allWeights[setting["name"]];
    };

    self.randomizeRadioSetting = function randomizeRadioSetting(setting, conflictingSettings) {
        const weights = self.allWeights[setting["name"]];
        const hasConflictingSettings = conflictingSettings !== undefined
                                       && conflictingSettings.length > 0;
        // We need to create a series of buckets, based on the option weights.
        // Whatever bucket the number falls into, that option is chosen.
        let bucketRange = 0;
        let buckets = [];
        for (const option of setting["options"]) {
            // Do not create this bucket if this option conflicts with the provided
            // conflictingSetting.
            let validOption = true;
            if (hasConflictingSettings && option["conflict"] !== undefined) {
                const conflict = option["conflict"];
                for (const conflictingSetting of conflictingSettings) {
                    if (conflict["name"] === conflictingSetting["name"]
                        && conflict["value"].includes(conflictingSetting["value"])) {
                        validOption = false;
                    }
                }
            }
            if (validOption) {
                bucketRange += weights[option["name"]];
                buckets.push({name: option["name"], topRange: bucketRange});
            }
        }

        const randNum = Math.random() * bucketRange;
        for (const bucket of buckets) {
            if (randNum < bucket.topRange) {
                return bucket.name;
            }
        }

        // We should never get here.
        return undefined;
    };

    self.randomizeMultiSetting = function randomizeMultiSetting(setting) {
        const weights = self.allWeights[setting["name"]];
        // Each individual option is randomized the same way as a binary
        // setting. If it passes, it gets added to the array.
        let optionList = [];
        for (const option of setting["options"]) {
            if (Math.random() < weights[option["name"]]) {
                optionList.push(option["name"]);
            }
        }
        return optionList;
    };

    self.randomizeNumericSetting = function randomizeNumericSetting(setting) {
        const weights = self.allWeights[setting["name"]];
        if (weights["distribution"] === "uniform") {
            return self.randomizeNumericUniform(setting);
        } else if (weights["distribution"] === "gaussian") {
            return self.randomizeNumericNormal(setting);
        }

        // No idea how we get here.
        return undefined;
    };

    // A number is selected entirely at random from the given range.
    self.randomizeNumericUniform = function randomizeNumericUniform(setting) {
        const weights = self.allWeights[setting["name"]];
        const min = weights["min"];
        const max = weights["max"];

        const randNum = ((max - min) * Math.random()) + min;
        return Math.floor(randNum + 0.5);
    };

    // In short, we draw a random number from on a normal distribution, based on
    // the provided min, max and mean parameters.
    self.randomizeNumericNormal = function randomizeNumericNormal(setting) {
        const weights = self.allWeights[setting["name"]];
        const min = weights["min"];
        const max = weights["max"];
        const mean = weights["mean"];
        // First off, if the min equals the max, just return that number.
        if (min === max) {
            return min;
        }
        // We need to determine the standard deviation. This will be one-third of
        // the difference between the mean and the min, or the mean and the max,
        // whichever is larger.
        const minDiff = mean - min;
        const maxDiff = max - mean;
        const minBased = minDiff >= maxDiff;
        const sdev = minBased ? minDiff / 3 : maxDiff / 3;
        // We need to determine the scale difference between the minDiff and maxDiff,
        // since we will use that to adjust numbers outside the range.
        const oppositeScale = minBased ? maxDiff / minDiff : minDiff / maxDiff;

        // Obtain the random number, based on the mean and sdev.
        let randNum = self.randomNormalValue(mean, sdev);

        // How we proceed depends on which side of the distribution the number fell on.
        if (minBased) {
            // If our number fell on the min side, just make sure it isn't below our
            // actual minimum. If it is, return the minimum. (This should only happen
            // 0.15% of the time.)
            if (randNum <= mean) {
                if (randNum < min) {
                    randNum = min;
                }
            } else {
                // Otherwise, we need to adjust the number so it fits into the different
                // scale of the max side.
                randNum = ((randNum - mean) * oppositeScale) + mean;

                // Then trim the number by the actual max.
                if (randNum > max) {
                    randNum = max;
                }
            }
        } else {
            // If our number fell on the max side, just make sure it isn't above our
            // actual maximum. If it is, return the maximum. (This should only happen
            // 0.15% of the time.)
            if (randNum >= mean) {
                if (randNum > max) {
                    randNum = max;
                }
            } else {
                // Otherwise, we need to adjust the number so it fits into the different
                // scale of the min side.
                randNum = ((randNum - mean) * oppositeScale) + mean;

                // Then trim the number by the actual min.
                if (randNum < min) {
                    randNum = min;
                }
            }
        }

        // Return the number, rounded to the nearest integer.
        return Math.floor(randNum + 0.5);
    };

    // This algorithm is apparently called a Box-Muller transform.
    self.randomNormalValue = function randomNormalValue(mean, sdev) {
        let u1 = 0;
        let u2 = 0;
        while (u1 === 0) u1 = Math.random();
        while (u2 === 0) u2 = Math.random();
        const r = Math.sqrt(-2.0 * Math.log(u1));
        const theta = 2.0 * Math.PI * u2;
        const u0 = r * Math.cos(theta);
        return mean + (sdev * u0);
    };

    // Handle special cases.
    self.randomizeSpecialCases = function randomizeSpecialCases(setting, settingsObject) {
        if (setting["name"] === "triforce_count_per_world") {
            const triforce_goal = settingsObject["triforce_goal_per_world"];
            // If the goal number has not been set, return undefined.
            if (triforce_goal === undefined) {
                return undefined;
            }

            const min = setting["special_options"]["scale_min"];
            const max = setting["special_options"]["scale_max"];
            const randScale = ((max - min) * Math.random()) + min;
            return Math.floor((triforce_goal * randScale) + 0.5);
        }

        return undefined;
    };

    // Generate the hints needed to convey critical settings.
    self.createCriticalHints = function createCriticalHints(settingsObject) {
        let hintsArray = [];
        let locationsArray = [
            "ToT (Left)",
            "ToT (Left-Center)",
            "ToT (Right-Center)",
            "ToT (Right)"
        ];

        // First option: Triforce Hunt.
        if (settingsObject["triforce_hunt"] === true) {
            const triforceCount = settingsObject["triforce_goal_per_world"];
            const triforceHint = `They say that #Ganondorf# can be defeated with the power of ` +
            `#${self.getNumberText(triforceCount)}# pieces of the #Triforce#.`;
            const hintObject = {
                "text": triforceHint,
                "colors": ["Yellow", "Green", "Red"]
            }
            hintsArray.push(hintObject);
        }

        // Second option: rainbow bridge.
        const bridgeSetting = settingsObject["bridge"];
        if (bridgeSetting === "open") {
            const bridgeHint = `They say that a #rainbow bridge# has appeared in front of ` +
            `#Ganondorf's castle#.`;
            const hintObject = {
                "text": bridgeHint,
                "colors": ["Red", "Pink"]
            }
            hintsArray.push(hintObject);
        } else if (bridgeSetting === "vanilla") {
            const bridgeHint = `They say that the #rainbow bridge# will appear for one who ` +
            `bears the #Shadow# and #Spirit# Medallions and the #Light Arrows#.`;
            const hintObject = {
                "text": bridgeHint,
                "colors": ["Yellow", "Yellow", "Pink", "Pink"]
            }
            hintsArray.push(hintObject);
        } else if (bridgeSetting === "stones") {
            const stoneCount = settingsObject["bridge_stones"];
            const stonePhrase = stoneCount === 1 ? "Spiritual Stone" : "Spiritual Stones";
            const bridgeHint = `They say that the #rainbow bridge# will appear by the power of ` +
            `#${self.getNumberText(stoneCount)} ${stonePhrase}#.`;
            const hintObject = {
                "text": bridgeHint,
                "colors": ["Green", "Pink"]
            }
            hintsArray.push(hintObject);
        } else if (bridgeSetting === "medallions") {
            const medallionCount = settingsObject["bridge_medallions"];
            const medallionPhrase = medallionCount === 1 ? "medallion" : "medallions";
            const bridgeHint = `They say that the #rainbow bridge# will appear by the power of ` +
            `#${self.getNumberText(medallionCount)} ${medallionPhrase}#.`;
            const hintObject = {
                "text": bridgeHint,
                "colors": ["Green", "Pink"]
            }
            hintsArray.push(hintObject);
        } else if (bridgeSetting === "dungeons") {
            const dungeonCount = settingsObject["bridge_rewards"];
            const dungeonPhrase = dungeonCount === 1 ? "dungeon" : "dungeons";
            const bridgeHint = `They say that the #rainbow bridge# will appear for one who has ` +
            `conquered #${self.getNumberText(dungeonCount)} ${dungeonPhrase}#.`;
            const hintObject = {
                "text": bridgeHint,
                "colors": ["Green", "Pink"]
            }
            hintsArray.push(hintObject);
        } else if (bridgeSetting === "tokens") {
            const tokenCount = settingsObject["bridge_tokens"];
            const tokenPhrase = tokenCount === 1 ? "Token" : "Tokens";
            const bridgeHint = `They say that the #rainbow bridge# will appear by the power of ` +
            `#${self.getNumberText(tokenCount)} Gold Skulltula ${tokenPhrase}#.`;
            const hintObject = {
                "text": bridgeHint,
                "colors": ["Green", "Pink"]
            }
            hintsArray.push(hintObject);
        } else if (bridgeSetting === "hearts") {
            const heartCount = settingsObject["bridge_hearts"];
            const bridgeHint = `They say that the #rainbow bridge# will appear for one who has ` +
            `#${self.getNumberText(heartCount)} hearts#.`;
            const hintObject = {
                "text": bridgeHint,
                "colors": ["Green", "Pink"]
            }
            hintsArray.push(hintObject);
        }

        // Third option: Ganon's boss key (incompatible with Triforce Hunt).
        const bossDoorSetting = settingsObject["shuffle_ganon_bosskey"];
        if (bossDoorSetting === "remove") {
            const bossDoorHint = `They say that the #door in Ganondorf's tower# is open to all.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "vanilla") {
            const bossDoorHint = `They say that the #key to Ganondorf's chambers# is guarded by ` +
            `Stalfos in #his own tower#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Light Blue", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "dungeon") {
            const bossDoorHint = `They say that #Ganondorf# has hidden the key to his chambers ` +
            `#somewhere in his castle#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Light Blue", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "regional") {
            const bossDoorHint = `They say that the #key to Ganondorf's chambers# is #not hidden ` +
            `far from his castle#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Light Blue", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "overworld") {
            const bossDoorHint = `They say that the #key to Ganondorf's chambers# is hidden ` +
            `#somewhere in the Hyrule overworld#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Light Blue", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "any_dungeon") {
            const bossDoorHint = `They say that the #key to Ganondorf's chambers# is hidden ` +
            `in #a dungeon somewhere in Hyrule#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Light Blue", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "keysanity") {
            const bossDoorHint = `They say that #no one knows# where the #key to Ganondorf's ` +
            `chambers# is hidden.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Red", "Pink"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "on_lacs") {
            const bossDoorHint = `They say that #Princess Zelda# waits in the #Temple of Time# ` +
            `to give the #key to Ganondorf's chambers#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Red", "Light Blue", "Light Blue"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "stones") {
            const stoneCount = settingsObject["ganon_bosskey_stones"];
            const stonePhrase = stoneCount === 1 ? "Spiritual Stone" : "Spiritual Stones";
            const bossDoorHint = `They say that #Ganondorf's door# will open by the power of ` +
            `#${self.getNumberText(stoneCount)} ${stonePhrase}#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Green", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "medallions") {
            const medallionCount = settingsObject["ganon_bosskey_medallions"];
            const medallionPhrase = medallionCount === 1 ? "medallion" : "medallions";
            const bossDoorHint = `They say that #Ganondorf's door# will open by the power of ` +
            `#${self.getNumberText(medallionCount)} ${medallionPhrase}#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Green", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "dungeons") {
            const dungeonCount = settingsObject["ganon_bosskey_rewards"];
            const dungeonPhrase = dungeonCount === 1 ? "dungeon" : "dungeons";
            const bossDoorHint = `They say that #Ganondorf's door# will open for one who has ` +
            `conquered #${self.getNumberText(dungeonCount)} ${dungeonPhrase}#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Green", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "tokens") {
            const tokenCount = settingsObject["ganon_bosskey_tokens"];
            const tokenPhrase = tokenCount === 1 ? "Token" : "Tokens";
            const bossDoorHint = `They say that #Ganondorf's door# will open by the power of ` +
            `#${self.getNumberText(tokenCount)} ${tokenPhrase}#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Green", "Red"]
            }
            hintsArray.push(hintObject);
        } else if (bossDoorSetting === "hearts") {
            const heartCount = settingsObject["ganon_bosskey_hearts"];
            const bossDoorHint = `They say that #Ganondorf's door# will open for one who has ` +
            `#${self.getNumberText(heartCount)} hearts#.`;
            const hintObject = {
                "text": bossDoorHint,
                "colors": ["Green", "Red"]
            }
            hintsArray.push(hintObject);
        }

        // Fourth option: LACS cutscene.
        const lacsCondition = settingsObject["lacs_condition"];
        if (lacsCondition === "vanilla") {
            const lacsHint = `They say that #Princess Zelda# waits in the #Temple of Time# for ` +
            `one bearing the #Shadow# and #Spirit# Medallions.`;
            const hintObject = {
                "text": lacsHint,
                "colors": ["Yellow", "Pink", "Light Blue", "Light Blue"]
            }
            hintsArray.push(hintObject);
        } else if (lacsCondition === "stones") {
            const stoneCount = settingsObject["lacs_stones"];
            const stonePhrase = stoneCount === 1 ? "Spiritual Stone" : "Spiritual Stones";
            const lacsHint = `They say that #Princess Zelda# waits in the #Temple of Time# for ` +
            `one bearing #${self.getNumberText(stoneCount)} ${stonePhrase}#.`;
            const hintObject = {
                "text": lacsHint,
                "colors": ["Green", "Light Blue", "Light Blue"]
            }
            hintsArray.push(hintObject);
        } else if (lacsCondition === "medallions") {
            const medallionCount = settingsObject["lacs_medallions"];
            const medallionPhrase = medallionCount === 1 ? "medallion" : "medallions";
            const lacsHint = `They say that #Princess Zelda# waits in the #Temple of Time# for ` +
            `one bearing #${self.getNumberText(medallionCount)} ${medallionPhrase}#.`;
            const hintObject = {
                "text": lacsHint,
                "colors": ["Green", "Light Blue", "Light Blue"]
            }
            hintsArray.push(hintObject);
        } else if (lacsCondition === "dungeons") {
            const dungeonCount = settingsObject["lacs_rewards"];
            const dungeonPhrase = dungeonCount === 1 ? "dungeon" : "dungeons";
            const lacsHint = `They say that #Princess Zelda# waits in the #Temple of Time# for ` +
            `one who has conquered #${self.getNumberText(dungeonCount)} ${dungeonPhrase}#.`;
            const hintObject = {
                "text": lacsHint,
                "colors": ["Green", "Light Blue", "Light Blue"]
            }
            hintsArray.push(hintObject);
        } else if (lacsCondition === "tokens") {
            const tokenCount = settingsObject["lacs_tokens"];
            const tokenPhrase = tokenCount === 1 ? "Token" : "Tokens";
            const lacsHint = `They say that #Princess Zelda# waits in the #Temple of Time# for ` +
            `one bearing #${self.getNumberText(tokenCount)} Gold Skulltula ${tokenPhrase}#.`;
            const hintObject = {
                "text": lacsHint,
                "colors": ["Green", "Light Blue", "Light Blue"]
            }
            hintsArray.push(hintObject);
        } else if (lacsCondition === "hearts") {
            const heartCount = settingsObject["lacs_hearts"];
            const lacsHint = `They say that #Princess Zelda# waits in the #Temple of Time# for ` +
            `one with #${self.getNumberText(heartCount)} hearts#.`;
            const hintObject = {
                "text": lacsHint,
                "colors": ["Green", "Light Blue", "Light Blue"]
            }
            hintsArray.push(hintObject);
        }

        // Fifth option: easier Fire Arrow Entry.
        const easierFae = settingsObject["easier_fire_arrow_entry"];
        if (easierFae === true) {
            const torchCount = settingsObject["fae_torch_count"];
            const torchPhrase = torchCount === 1 ? "torch" : "torches";
            const faeHint = `They say that the #Shadow Temple# can be opened by lighting ` +
            `#${self.getNumberText(torchCount)} ${torchPhrase}#.`;
            const hintObject = {
                "text": faeHint,
                "colors": ["Green", "Pink"]
            }
            hintsArray.push(hintObject);
        }

        // We should have at most four hints now. We'll assign the ones we have to the
        // Temple of Time Gossip Stones.
        let gossipStoneObject = {};
        for (let i = 0; i < hintsArray.length; i++) {
            gossipStoneObject[locationsArray[i]] = hintsArray[i];
        }

        return gossipStoneObject;
    };

    self.getNumberText = function getNumberText(num) {
        if (num === 1) return "one";
        if (num === 2) return "two";
        if (num === 3) return "three";
        if (num === 4) return "four";
        if (num === 5) return "five";
        if (num === 6) return "six";
        if (num === 7) return "seven";
        if (num === 8) return "eight";
        if (num === 9) return "nine";
        if (num === 10) return "ten";
        if (num === 11) return "eleven";
        if (num === 12) return "twelve";
        if (num === 13) return "thirteen";
        if (num === 14) return "fourteen";
        if (num === 15) return "fifteen";
        if (num === 16) return "sixteen";
        if (num === 17) return "seventeen";
        if (num === 18) return "eighteen";
        if (num === 19) return "nineteen";
        if (num === 20) return "twenty";
        return num.toString();
    }

    self.buildFinalSettings = function buildFinalSettings() {
        // Start by validating all of our settings. If anything is invalid,
        // an error will be thrown and this function will stop.
        self.validateSettings();

        let settingsObject = {};
        let settingsWithPrerequisites = [];
        // Iterate over all the settings.
        for (const category in self.allSettings) {
            for (const setting of self.allSettings[category]) {
                // Set aside special cases right away.
                if (setting["type"] === "special_case") {
                    settingsWithPrerequisites.push(setting);
                    continue;
                }
                // If this setting has an unaddressed prerequisite, set it aside.
                const prereqs = setting["prerequisite"];
                if (prereqs !== undefined) {
                    settingsWithPrerequisites.push(setting);
                } else {
                    settingsObject[setting["name"]] = self.randomizeSetting(setting);
                }
            }
        }

        // Now iterate over settings with prerequisites. Do this until the size
        // of the list doesn't change. Those settings will be discarded.
        let previousPrereqLength = 0;
        let currentPrereqLength = settingsWithPrerequisites.length;
        while (currentPrereqLength > 0 && currentPrereqLength !== previousPrereqLength) {
            previousPrereqLength = currentPrereqLength;
            let remainingSettingsWithPrerequisites = [];

            for (const setting of settingsWithPrerequisites) {
                // Special handling for special cases.
                if (setting["type"] === "special_case") {
                    const settingVal = self.randomizeSpecialCases(setting, settingsObject);
                    if (settingVal !== undefined) {
                        settingsObject[setting["name"]] = settingVal;
                    } else {
                        remainingSettingsWithPrerequisites.push(setting);
                    }
                    continue;
                }
                let conflictingSettings = [];
                let cannotAssignSetting = false;
                const prereqList = setting["prerequisite"];
                for (const prereq of prereqList) {
                    // If a prerequisite has an associated value, then that setting
                    // must have been assigned that value for this setting to be
                    // used. If a prereq has no value, then the setting needs to
                    // simply have been assigned at all (and the setting will be
                    // passed along for potential conflicts).
                    const prereqValue = settingsObject[prereq["name"]];
                    if (prereqValue === undefined
                        || (prereq["value"] !== undefined && !prereq["value"].includes(prereqValue))) {
                        cannotAssignSetting = true;
                        break;
                    }

                    // If this occurs, we have a setting with options that can conflict
                    // with the prerequisite's value. We should note this.
                    if (prereqValue !== undefined && prereq["value"] === undefined) {
                        conflictingSettings.push({
                            "name": prereq["name"],
                            "value": prereqValue
                        });
                    }
                }

                if (cannotAssignSetting) {
                    remainingSettingsWithPrerequisites.push(setting);
                } else {
                    settingsObject[setting["name"]] = self.randomizeSetting(setting, conflictingSettings);
                }
            }

            settingsWithPrerequisites = [...remainingSettingsWithPrerequisites];
            currentPrereqLength = settingsWithPrerequisites.length;
        }

        const plandoObject = {
            "settings": settingsObject
        };
        // If hints are on, add them now.
        if (self.criticalHintsOn) {
            plandoObject["gossip_stones"] = self.createCriticalHints(settingsObject);
        }

        // Save the settings to local storage.
        self.saveSettings();

        return plandoObject;
    };

    self.saveSettings = function saveSettings() {
        localStorage.setItem('weights', JSON.stringify(self.allWeights));
    };

    self.generateFinalSettings = function generateFinalSettings() {
        self.finalSettings = "";
        self.errorString = "";
        try {
            const finalSettingsObject = self.buildFinalSettings();
            self.finalSettings = JSON.stringify(finalSettingsObject, null, 2);
        } catch (error) {
            self.errorString = error.message;
        }
    };

    self.selectPlandoText = function selectPlandoText() {
        const input = document.getElementById('plandoTextElement');
        window.getSelection().selectAllChildren(input);
        navigator.clipboard.writeText(input.innerText);
    };
}