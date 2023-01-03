var randomSettingsCtrl = function randomSettingsCtrl($http) {
    let self = this;

    self.allSettings = {};
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
        self.simpleSettings = localStorage.getItem('simple_settings');
        self.criticalHintsOn = localStorage.getItem('critical_hints_on');
        return true;
    };

    /*$http.get('settings_list.json').then(function(response) {
        self.allSettings = response.data;
    });*/

    // For testing only.
    self.allSettings = {
        "General Settings": [
            {
                "name": "logic_rules",
                "label": "Logic Rules",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "glitchless",
                "options": [
                    {
                        "name": "glitchless",
                        "label": "Glitchless",
                        "weight": 1
                    },
                    {
                        "name": "glitched",
                        "label": "Glitched",
                        "weight": 0
                    },
                    {
                        "name": "none",
                        "label": "No Logic",
                        "weight": 0
                    }
                ]
            },
            {
                "name": "reachable_locations",
                "label": "Guarantee Reachable Locations",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "all",
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["glitched", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "all",
                        "label": "All"
                    },
                    {
                        "name": "goals",
                        "label": "All Goals"
                    },
                    {
                        "name": "beatable",
                        "label": "Required Only"
                    }
                ]
            },
            {
                "name": "logic_no_night_tokens_without_suns_song",
                "label": "Nighttime Skulltulas Expect Sun's Song",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["glitched", "glitchless"]
                    }
                ]
            },
            {
                "name": "start_with_consumables",
                "label": "Start With Consumables",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "start_with_rupees",
                "label": "Start With Max Rupees",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true,
            },
            {
                "name": "starting_hearts",
                "label": "Starting Hearts",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 3,
                "num_options": {
                    "distribution": "gaussian",
                    "min": 3,
                    "max": 20,
                    "mean": 3
                }
            }
        ],
        "Timesavers": [
            {
                "name": "no_escape_sequence",
                "label": "Skip Tower Escape Sequence",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "no_guard_stealth",
                "label": "Skip Child Stealth",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "no_epona_race",
                "label": "Skip Epona Race",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "skip_some_minigame_phases",
                "label": "Skip Some Minigame Phases",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "complete_mask_quest",
                "label": "Complete Mask Quest",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "useful_cutscenes",
                "label": "Enable Specific Glitch-Useful Cutscenes",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "fast_chests",
                "label": "Fast Chest Cutscenes",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "free_scarecrow",
                "label": "Free Scarecrow's Song",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "fast_bunny_hood",
                "label": "Fast Bunny Hood",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "plant_beans",
                "label": "Plant Magic Beans",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "chicken_count_random",
                "label": "Random Cucco Count",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "chicken_count",
                "label": "Cucco Count",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 7,
                "prerequisite": [
                    {
                        "name": "chicken_count_random",
                        "value": [false]
                    }
                ],
                "num_options": {
                    "distribution": "uniform",
                    "min": 0,
                    "max": 7,
                    "mean": 7
                }
            },
            {
                "name": "big_poe_count_random",
                "label": "Random Big Poe Target Count",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "big_poe_count",
                "label": "Big Poe Target Count",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 10,
                "prerequisite": [
                    {
                        "name": "big_poe_count_random",
                        "value": [false]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 10,
                    "mean": 3
                }
            },
            {
                "name": "easier_fire_arrow_entry",
                "label": "Easier Fire Arrow Entry",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "fae_torch_count",
                "label": "Fire Arrow Entry Torch Count",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 3,
                "prerequisite": [
                    {
                        "name": "easier_fire_arrow_entry",
                        "value": [true]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 23,
                    "mean": 3
                }
            }
        ],
        "Open": [
            {
                "name": "open_forest",
                "label": "Forest",
                "type": "radio",
                "simple_shuffle": true,
                "options": [
                    {
                        "name": "open",
                        "label": "Open Forest"
                    },
                    {
                        "name": "closed_deku",
                        "label": "Closed Deku"
                    },
                    {
                        "name": "closed",
                        "label": "Closed Forest"
                    }
                ]
            },
            {
                "name": "open_kakariko",
                "label": "Kakariko Gate",
                "type": "radio",
                "simple_shuffle": true,
                "options": [
                    {
                        "name": "open",
                        "label": "Open Gate"
                    },
                    {
                        "name": "zelda",
                        "label": "Zelda's Letter Opens Gate"
                    },
                    {
                        "name": "closed",
                        "label": "Closed Gate"
                    }
                ]
            },
            {
                "name": "open_door_of_time",
                "label": "Open Door of Time",
                "type": "binary",
                "simple_shuffle": true
            },
            {
                "name": "zora_fountain",
                "label": "Zora's Fountain",
                "type": "radio",
                "simple_shuffle": true,
                "options": [
                    {
                        "name": "closed",
                        "label": "Default Behavior (Closed)"
                    },
                    {
                        "name": "adult",
                        "label": "Open For Adult"
                    },
                    {
                        "name": "open",
                        "label": "Always Open"
                    }
                ]
            },
            {
                "name": "gerudo_fortress",
                "label": "Gerudo's Fortress",
                "type": "radio",
                "simple_shuffle": true,
                "options": [
                    {
                        "name": "normal",
                        "label": "Default Behavior"
                    },
                    {
                        "name": "fast",
                        "label": "Rescue One Carpenter"
                    },
                    {
                        "name": "open",
                        "label": "Open Gerudo's Fortress"
                    }
                ]
            },
            {
                "name": "dungeon_shortcuts_choice",
                "label": "Dungeon Boss Shortcuts Mode",
                "type": "radio",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules"
                    }
                ],
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "choice",
                        "label": "Specific Dungeons",
                        "conflict": {
                            "name": "logic_rules",
                            "value": ["glitched"]
                        }
                    },
                    {
                        "name": "all",
                        "label": "All dungeons"
                    },
                    {
                        "name": "random",
                        "label": "Random dungeons"
                    }
                ]
            },
            {
                "name": "dungeon_shortcuts",
                "label": "Dungeon Boss Shortcuts",
                "type": "multi",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "dungeon_shortcuts_choice",
                        "value": ["choice"]
                    }
                ],
                "options": [
                    {
                        "name": "Deku Tree",
                        "label": "Deku Tree"
                    },
                    {
                        "name": "Dodongos Cavern",
                        "label": "Dodongo's Cavern"
                    },
                    {
                        "name": "Jabu Jabus Belly",
                        "label": "Jabu Jabu's Belly"
                    },
                    {
                        "name": "Forest Temple",
                        "label": "Forest Temple"
                    },
                    {
                        "name": "Fire Temple",
                        "label": "Fire Temple"
                    },
                    {
                        "name": "Water Temple",
                        "label": "Water Temple"
                    },
                    {
                        "name": "Shadow Temple",
                        "label": "Shadow Temple"
                    },
                    {
                        "name": "Spirit Temple",
                        "label": "Spirit Temple"
                    }
                ]
            },
            {
                "name": "lacs_condition",
                "label": "LACS Condition",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "vanilla",
                "options": [
                    {
                        "name": "vanilla",
                        "label": "Vanilla",
                        "weight": 1
                    },
                    {
                        "name": "stones",
                        "label": "Stones",
                        "weight": 1
                    },
                    {
                        "name": "medallions",
                        "label": "Medallions",
                        "weight": 1
                    },
                    {
                        "name": "dungeons",
                        "label": "Dungeons",
                        "weight": 1
                    },
                    {
                        "name": "tokens",
                        "label": "Tokens",
                        "weight": 0
                    },
                    {
                        "name": "hearts",
                        "label": "Hearts",
                        "weight": 0
                    }
                ]
            },
            {
                "name": "lacs_medallions",
                "label": "Medallions Required for LACS",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 6,
                "prerequisite": [
                    {
                        "name": "lacs_condition",
                        "value": ["medallions"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 6,
                    "mean": 4
                }
            },
            {
                "name": "lacs_stones",
                "label": "Spiritual Stones Required for LACS",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 3,
                "prerequisite": [
                    {
                        "name": "lacs_condition",
                        "value": ["stones"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 3,
                    "mean": 3
                }
            },
            {
                "name": "lacs_rewards",
                "label": "Dungeon Rewards Required for LACS",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 9,
                "prerequisite": [
                    {
                        "name": "lacs_condition",
                        "value": ["dungeons"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 9,
                    "mean": 6
                }
            },
            {
                "name": "lacs_tokens",
                "label": "Gold Skulltula Tokens Required for LACS",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 100,
                "prerequisite": [
                    {
                        "name": "lacs_condition",
                        "value": ["tokens"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 100,
                    "mean": 40
                }
            },
            {
                "name": "lacs_hearts",
                "label": "Hearts Required for LACS",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 20,
                "prerequisite": [
                    {
                        "name": "lacs_condition",
                        "value": ["hearts"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 4,
                    "max": 20,
                    "mean": 8
                }
            },
            {
                "name": "bridge",
                "label": "Rainbow Bridge Requirement",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "medallions",
                "options": [
                    {
                        "name": "open",
                        "label": "Always Open",
                        "weight": 1
                    },
                    {
                        "name": "vanilla",
                        "label": "Vanilla Requirements",
                        "weight": 1
                    },
                    {
                        "name": "stones",
                        "label": "Spiritual Stones",
                        "weight": 1
                    },
                    {
                        "name": "medallions",
                        "label": "Medallions",
                        "weight": 1
                    },
                    {
                        "name": "dungeons",
                        "label": "Dungeons",
                        "weight": 1
                    },
                    {
                        "name": "tokens",
                        "label": "Gold Skulltula Tokens",
                        "weight": 0
                    },
                    {
                        "name": "hearts",
                        "label": "Hearts",
                        "weight": 0
                    }
                ]
            },
            {
                "name": "bridge_medallions",
                "label": "Medallions Required for Bridge",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 6,
                "prerequisite": [
                    {
                        "name": "bridge",
                        "value": ["medallions"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 6,
                    "mean": 6
                }
            },
            {
                "name": "bridge_stones",
                "label": "Spiritual Stones Required for Bridge",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 3,
                "prerequisite": [
                    {
                        "name": "bridge",
                        "value": ["stones"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 3,
                    "mean": 3
                }
            },
            {
                "name": "bridge_rewards",
                "label": "Dungeon Rewards Required for Bridge",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 9,
                "prerequisite": [
                    {
                        "name": "bridge",
                        "value": ["dungeons"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 9,
                    "mean": 9
                }
            },
            {
                "name": "bridge_tokens",
                "label": "Skulltulas Required for Bridge",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 100,
                "prerequisite": [
                    {
                        "name": "bridge",
                        "value": ["tokens"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 100,
                    "mean": 50
                }
            },
            {
                "name": "bridge_hearts",
                "label": "Hearts Required for Bridge",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 20,
                "prerequisite": [
                    {
                        "name": "bridge",
                        "value": ["hearts"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 4,
                    "max": 20,
                    "mean": 10
                }
            },
            {
                "name": "trials_random",
                "label": "Random Number of Ganon's Trials",
                "type": "binary",
                "simple_shuffle": true,
                "weight": 1
            },
            {
                "name": "trials",
                "label": "Ganon's Trials Count",
                "type": "numeric",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "trials_random",
                        "value": [false]
                    }
                ],
                "num_options": {
                    "distribution": "uniform",
                    "min": 0,
                    "max": 6,
                    "mean": 3
                }
            }
        ],
        "Shuffle Dungeon Items": [
            {
                "name": "shuffle_mapcompass",
                "label": "Maps & Compasses",
                "type": "radio",
                "simple_shuffle": true,
                "options": [
                    {
                        "name": "remove",
                        "label": "Remove (Keysy)"
                    },
                    {
                        "name": "startwith",
                        "label": "Start With"
                    },
                    {
                        "name": "vanilla",
                        "label": "Vanilla Locations"
                    },
                    {
                        "name": "dungeon",
                        "label": "Own Dungeon"
                    },
                    {
                        "name": "regional",
                        "label": "Regional"
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only"
                    },
                    {
                        "name": "any_dungeon",
                        "label": "Any Dungeon"
                    },
                    {
                        "name": "keysanity",
                        "label": "Anywhere"
                    }
                ]
            },
            {
                "name": "shuffle_smallkeys",
                "label": "Small Keys",
                "type": "radio",
                "simple_shuffle": true,
                "options": [
                    {
                        "name": "remove",
                        "label": "Remove (Keysy)"
                    },
                    {
                        "name": "vanilla",
                        "label": "Vanilla Locations"
                    },
                    {
                        "name": "dungeon",
                        "label": "Own Dungeon"
                    },
                    {
                        "name": "regional",
                        "label": "Regional"
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only"
                    },
                    {
                        "name": "any_dungeon",
                        "label": "Any Dungeon"
                    },
                    {
                        "name": "keysanity",
                        "label": "Anywhere (Keysanity)"
                    }
                ]
            },
            {
                "name": "shuffle_hideoutkeys",
                "label": "Thieves' Hideout Keys",
                "type": "radio",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "gerudo_fortress",
                        "value": ["normal", "fast"]
                    }
                ],
                "options": [
                    {
                        "name": "vanilla",
                        "label": "Vanilla Locations",
                        "weight": 1
                    },
                    {
                        "name": "fortress",
                        "label": "Gerudo Fortress Region",
                        "weight": 0
                    },
                    {
                        "name": "regional",
                        "label": "Regional",
                        "weight": 1
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only",
                        "weight": 1
                    },
                    {
                        "name": "any_dungeon",
                        "label": "Any Dungeon",
                        "weight": 1
                    },
                    {
                        "name": "keysanity",
                        "label": "Anywhere (Keysanity)",
                        "weight": 1
                    }
                ]
            },
            {
                "name": "key_rings_choice",
                "label": "Key Rings Mode",
                "type": "radio",
                "simple_shuffle": true,
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "choice",
                        "label": "Choose dungeons"
                    },
                    {
                        "name": "all",
                        "label": "All dungeons"
                    },
                    {
                        "name": "random",
                        "label": "Random dungeons"
                    }
                ]
            },
            {
                "name": "key_rings",
                "label": "Key Rings",
                "type": "multi",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "key_rings_choice",
                        "value": ["choice"]
                    }
                ],
                "options": [
                    {
                        "name": "Thieves Hideout",
                        "label": "Thieves' Hideout"
                    },
                    {
                        "name": "Forest Temple",
                        "label": "Forest Temple"
                    },
                    {
                        "name": "Fire Temple",
                        "label": "Fire Temple"
                    },
                    {
                        "name": "Water Temple",
                        "label": "Water Temple"
                    },
                    {
                        "name": "Shadow Temple",
                        "label": "Shadow Temple"
                    },
                    {
                        "name": "Spirit Temple",
                        "label": "Spirit Temple"
                    },
                    {
                        "name": "Bottom of the Well",
                        "label": "Bottom of the Well"
                    },
                    {
                        "name": "Gerudo Training Ground",
                        "label": "Gerudo Training Ground"
                    },
                    {
                        "name": "Ganons Castle",
                        "label": "Ganon's Castle"
                    }
                ]
            },
            {
                "name": "shuffle_bosskeys",
                "label": "Boss Keys",
                "type": "radio",
                "simple_shuffle": true,
                "options": [
                    {
                        "name": "remove",
                        "label": "Remove (Keysy)"
                    },
                    {
                        "name": "vanilla",
                        "label": "Vanilla Locations"
                    },
                    {
                        "name": "dungeon",
                        "label": "Own Dungeon"
                    },
                    {
                        "name": "regional",
                        "label": "Regional"
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only"
                    },
                    {
                        "name": "any_dungeon",
                        "label": "Any Dungeon"
                    },
                    {
                        "name": "keysanity",
                        "label": "Anywhere (Keysanity)"
                    }
                ]
            },
            {
                "name": "shuffle_ganon_bosskey",
                "label": "Ganon's Boss Key",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "dungeon",
                "prerequisite": [
                    {
                        "name": "triforce_hunt",
                        "value": [false]
                    }
                ],
                "options": [
                    {
                        "name": "remove",
                        "label": "Remove (Keysy)",
                        "weight": 4
                    },
                    {
                        "name": "vanilla",
                        "label": "Vanilla Location",
                        "weight": 2
                    },
                    {
                        "name": "dungeon",
                        "label": "Own Dungeon",
                        "weight": 2
                    },
                    {
                        "name": "regional",
                        "label": "Regional",
                        "weight": 0
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only",
                        "weight": 0
                    },
                    {
                        "name": "any_dungeon",
                        "label": "Any Dungeon",
                        "weight": 0
                    },
                    {
                        "name": "keysanity",
                        "label": "Anywhere (Keysanity)",
                        "weight": 4
                    },
                    {
                        "name": "on_lacs",
                        "label": "Light Arrow Cutscene",
                        "weight": 1
                    },
                    {
                        "name": "stones",
                        "label": "Stones",
                        "weight": 0
                    },
                    {
                        "name": "medallions",
                        "label": "Medallions",
                        "weight": 0
                    },
                    {
                        "name": "dungeons",
                        "label": "Dungeons",
                        "weight": 0
                    },
                    {
                        "name": "tokens",
                        "label": "Tokens",
                        "weight": 0
                    },
                    {
                        "name": "hearts",
                        "label": "Hearts",
                        "weight": 0
                    }
                ]
            },
            {
                "name": "ganon_bosskey_medallions",
                "label": "Medallions Required for Ganon's BK",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 6,
                "prerequisite": [
                    {
                        "name": "shuffle_ganon_bosskey",
                        "value": ["medallions"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 6,
                    "mean": 6
                }
            },
            {
                "name": "ganon_bosskey_stones",
                "label": "Spiritual Stones Required for Ganon's BK",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 3,
                "prerequisite": [
                    {
                        "name": "shuffle_ganon_bosskey",
                        "value": ["stones"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 3,
                    "mean": 3
                }
            },
            {
                "name": "ganon_bosskey_rewards",
                "label": "Dungeon Rewards Required for Ganon's BK",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 9,
                "prerequisite": [
                    {
                        "name": "shuffle_ganon_bosskey",
                        "value": ["dungeons"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 9,
                    "mean": 9
                }
            },
            {
                "name": "ganon_bosskey_tokens",
                "label": "Gold Skulltula Tokens Required for Ganon's BK",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 100,
                "prerequisite": [
                    {
                        "name": "shuffle_ganon_bosskey",
                        "value": ["tokens"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 100,
                    "mean": 50
                }
            },
            {
                "name": "ganon_bosskey_hearts",
                "label": "Hearts Required for Ganon's BK",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 20,
                "prerequisite": [
                    {
                        "name": "shuffle_ganon_bosskey",
                        "value": ["hearts"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 4,
                    "max": 20,
                    "mean": 10
                }
            },
            {
                "name": "enhance_map_compass",
                "label": "Maps and Compasses Give Information",
                "type": "binary",
                "simple_shuffle": true
            }
        ],
        "World": [
            {
                "name": "starting_age",
                "label": "Starting Age",
                "type": "radio",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "open_forest"
                    }
                ],
                "options": [
                    {
                        "name": "child",
                        "label": "Child"
                    },
                    {
                        "name": "adult",
                        "label": "Adult",
                        "conflict": {
                            "name": "open_forest",
                            "value": ["closed"]
                        }
                    }
                ]
            },
            {
                "name": "mq_dungeons_mode",
                "label": "MQ Dungeon Mode",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "vanilla",
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "vanilla",
                        "label": "Vanilla",
                        "weight": 0
                    },
                    {
                        "name": "mq",
                        "label": "Master Quest",
                        "weight": 0
                    },
                    {
                        "name": "specific",
                        "label": "Specific Dungeons",
                        "weight": 0
                    },
                    {
                        "name": "count",
                        "label": "Count",
                        "weight": 0
                    },
                    {
                        "name": "random",
                        "label": "Completely Random",
                        "weight": 1
                    }
                ]
            },
            {
                "name": "mq_dungeons_specific",
                "label": "MQ Dungeons",
                "type": "multi",
                "simple_shuffle": false,
                "default_value": [],
                "prerequisite": [
                    {
                        "name": "mq_dungeons_mode",
                        "value": ["specific"]
                    }
                ],
                "options": [
                    {
                        "name": "Deku Tree",
                        "label": "Deku Tree"
                    },
                    {
                        "name": "Dodongos Cavern",
                        "label": "Dodongo's Cavern"
                    },
                    {
                        "name": "Jabu Jabus Belly",
                        "label": "Jabu Jabu's Belly"
                    },
                    {
                        "name": "Forest Temple",
                        "label": "Forest Temple"
                    },
                    {
                        "name": "Fire Temple",
                        "label": "Fire Temple"
                    },
                    {
                        "name": "Water Temple",
                        "label": "Water Temple"
                    },
                    {
                        "name": "Shadow Temple",
                        "label": "Shadow Temple"
                    },
                    {
                        "name": "Spirit Temple",
                        "label": "Spirit Temple"
                    },
                    {
                        "name": "Bottom of the Well",
                        "label": "Bottom of the Well"
                    },
                    {
                        "name": "Ice Cavern",
                        "label": "Ice Cavern"
                    },
                    {
                        "name": "Gerudo Training Ground",
                        "label": "Gerudo Training Ground"
                    },
                    {
                        "name": "Ganons Castle",
                        "label": "Ganon's Castle"
                    }
                ]
            },
            {
                "name": "mq_dungeons_count",
                "label": "MQ Dungeon Count",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 0,
                "prerequisite": [
                    {
                        "name": "mq_dungeons_mode",
                        "value": ["count"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 0,
                    "max": 12,
                    "mean": 0
                }
            },
            {
                "name": "empty_dungeons_mode",
                "label": "Pre-completed Dungeons Mode",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "none",
                "options": [
                    {
                        "name": "none",
                        "label": "Off",
                        "weight": 1
                    },
                    {
                        "name": "specific",
                        "label": "Specific Dungeons",
                        "weight": 0
                    },
                    {
                        "name": "count",
                        "label": "Count",
                        "weight": 0
                    }
                ]
            },
            {
                "name": "empty_dungeons_specific",
                "label": "Pre-completed Dungeons",
                "type": "multi",
                "simple_shuffle": false,
                "default_value": [],
                "prerequisite": [
                    {
                        "name": "empty_dungeons_mode",
                        "value": ["specific"]
                    }
                ],
                "options": [
                    {
                        "name": "Deku Tree",
                        "label": "Deku Tree"
                    },
                    {
                        "name": "Dodongos Cavern",
                        "label": "Dodongo's Cavern"
                    },
                    {
                        "name": "Jabu Jabus Belly",
                        "label": "Jabu Jabu's Belly"
                    },
                    {
                        "name": "Forest Temple",
                        "label": "Forest Temple"
                    },
                    {
                        "name": "Fire Temple",
                        "label": "Fire Temple"
                    },
                    {
                        "name": "Water Temple",
                        "label": "Water Temple"
                    },
                    {
                        "name": "Shadow Temple",
                        "label": "Shadow Temple"
                    },
                    {
                        "name": "Spirit Temple",
                        "label": "Spirit Temple"
                    }
                ]
            },
            {
                "name": "empty_dungeons_count",
                "label": "Pre-completed Dungeon Count",
                "type": "numeric",
                "simple_shuffle": false,
                "default_value": 2,
                "prerequisite": [
                    {
                        "name": "empty_dungeons_mode",
                        "value": ["count"]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 8,
                    "mean": 2
                }
            },
            {
                "name": "shuffle_interior_entrances",
                "label": "Shuffle Interior Entrances",
                "type": "radio",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "off",
                        "label": "Off",
                        "weight": 2
                    },
                    {
                        "name": "simple",
                        "label": "Simple Interiors",
                        "weight": 1
                    },
                    {
                        "name": "all",
                        "label": "All Interiors",
                        "weight": 1
                    }
                ]
            },
            {
                "name": "shuffle_grotto_entrances",
                "label": "Shuffle Grotto Entrances",
                "type": "binary",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ]
            },
            {
                "name": "shuffle_dungeon_entrances",
                "label": "Shuffle Dungeon Entrances",
                "type": "radio",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "off",
                        "label": "Off",
                        "weight": 2
                    },
                    {
                        "name": "simple",
                        "label": "Dungeon",
                        "weight": 1
                    },
                    {
                        "name": "all",
                        "label": "Dungeon and Ganon",
                        "weight": 1
                    }
                ]
            },
            {
                "name": "shuffle_bosses",
                "label": "Shuffle Boss Entrances",
                "type": "radio",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "limited",
                        "label": "Age-Restricted"
                    },
                    {
                        "name": "full",
                        "label": "full"
                    }
                ]
            },
            {
                "name": "shuffle_overworld_entrances",
                "label": "Shuffle Overworld Entrances",
                "type": "binary",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ]
            },
            {
                "name": "owl_drops",
                "label": "Randomize Owl Drops",
                "type": "binary",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ]
            },
            {
                "name": "warp_songs",
                "label": "Randomize Warp Song Destinations",
                "type": "binary",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ]
            },
            {
                "name": "spawn_positions",
                "label": "Randomize Overworld Spawns",
                "type": "multi",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "child",
                        "label": "Child"
                    },
                    {
                        "name": "adult",
                        "label": "Adult"
                    }
                ]
            },
            {
                "name": "triforce_hunt",
                "label": "Triforce Hunt",
                "type": "binary",
                "simple_shuffle": true
            },
            {
                "name": "triforce_goal_per_world",
                "label": "Required Triforces Per World",
                "type": "numeric",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "triforce_hunt",
                        "value": [true]
                    }
                ],
                "num_options": {
                    "distribution": "gaussian",
                    "min": 1,
                    "max": 100,
                    "mean": 20
                }
            },
            {
                "name": "triforce_count_per_world",
                "label": "Triforces Per World",
                "type": "special_case",
                "simple_shuffle": true,
                "prerequisite": [
                    {
                        "name": "triforce_hunt",
                        "value": [true]
                    }
                ],
                "special_options": {
                    "scale_min": 1,
                    "scale_max": 2
                }
            },
            {
                "name": "bombchus_in_logic",
                "label": "Bombchus Are Considered in Logic",
                "type": "binary",
                "simple_shuffle": true
            },
            {
                "name": "one_item_per_dungeon",
                "label": "Dungeons Have One Major Item",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false,
                "weight": 0,
                "prerequisite": [
                    {
                        "name": "shuffle_smallkeys",
                        "value": ["remove", "vanilla", "dungeon", "regional", "overworld", "keysanity"]
                    },
                    {
                        "name": "item_pool_value",
                        "value": ["plentiful", "balanced", "scarce", "minimal"]
                    }
                ]
            }
        ],
        "Shuffle": [
            {
                "name": "shuffle_song_items",
                "label": "Shuffle Songs",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "song",
                "options": [
                    {
                        "name": "song",
                        "label": "Song Locations",
                        "weight": 2
                    },
                    {
                        "name": "dungeon",
                        "label": "Dungeon Rewards",
                        "weight": 1
                    },
                    {
                        "name": "any",
                        "label": "Anywhere",
                        "weight": 1
                    }
                ]
            },
            {
                "name": "shopsanity",
                "label": "Shopsanity",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "off",
                "options": [
                    {
                        "name": "off",
                        "label": "Off",
                        "weight": 6
                    },
                    {
                        "name": "0",
                        "label": "0 Items Per Shop",
                        "weight": 1
                    },
                    {
                        "name": "1",
                        "label": "1 Item Per Shop",
                        "weight": 1
                    },
                    {
                        "name": "2",
                        "label": "2 Items Per Shop",
                        "weight": 1
                    },
                    {
                        "name": "3",
                        "label": "3 Items Per Shop",
                        "weight": 1
                    },
                    {
                        "name": "4",
                        "label": "4 Items Per Shop",
                        "weight": 1
                    },
                    {
                        "name": "random",
                        "label": "Random # of Items Per Shop",
                        "weight": 1
                    }
                ]
            },
            {
                "name": "shopsanity_prices",
                "label": "Shopsanity Prices",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "random",
                "prerequisite": [
                    {
                        "name": "shopsanity",
                        "value": ["1", "2", "3", "4", "random"]
                    }
                ],
                "options": [
                    {
                        "name": "random",
                        "label": "Random"
                    },
                    {
                        "name": "random_starting",
                        "label": "Starting Wallet"
                    },
                    {
                        "name": "random_adult",
                        "label": "Adult's Wallet"
                    },
                    {
                        "name": "random_giant",
                        "label": "Giant's Wallet"
                    },
                    {
                        "name": "random_tycoon",
                        "label": "Tycoon's Wallet"
                    },
                    {
                        "name": "affordable",
                        "label": "Affordable"
                    }
                ]
            },
            {
                "name": "tokensanity",
                "label": "Tokensanity",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "off",
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "dungeons",
                        "label": "Dungeons Only"
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only"
                    },
                    {
                        "name": "all",
                        "label": "All Tokens"
                    }
                ]
            },
            {
                "name": "shuffle_scrubs",
                "label": "Scrub Shuffle",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "off",
                "options": [
                    {
                        "name": "off",
                        "label": "Off",
                        "weight": 1
                    },
                    {
                        "name": "low",
                        "label": "On (Affordable)",
                        "weight": 1
                    },
                    {
                        "name": "regular",
                        "label": "On (Expensive)",
                        "weight": 0
                    },
                    {
                        "name": "random",
                        "label": "On (Random Prices)",
                        "weight": 0
                    }
                ]
            },
            {
                "name": "shuffle_child_trade",
                "label": "Shuffle Child Trade Item",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "vanilla",
                "options": [
                    {
                        "name": "vanilla",
                        "label": "Vanilla Locations"
                    },
                    {
                        "name": "shuffle",
                        "label": "Shuffle Weird Egg"
                    },
                    {
                        "name": "skip_child_zelda",
                        "label": "Skip Child Zelda"
                    }
                ]
            },
            {
                "name": "shuffle_freestanding_items",
                "label": "Shuffle Rupees & Hearts",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "off",
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "all",
                        "label": "All"
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only"
                    },
                    {
                        "name": "dungeons",
                        "label": "Dungeons Only"
                    }
                ]
            },
            {
                "name": "shuffle_pots",
                "label": "Shuffle Pots",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "off",
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "all",
                        "label": "All"
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only"
                    },
                    {
                        "name": "dungeons",
                        "label": "Dungeons Only"
                    }
                ]
            },
            {
                "name": "shuffle_crates",
                "label": "Shuffle Crates",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "off",
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "all",
                        "label": "All"
                    },
                    {
                        "name": "overworld",
                        "label": "Overworld Only"
                    },
                    {
                        "name": "dungeons",
                        "label": "Dungeons Only"
                    }
                ]
            },
            {
                "name": "shuffle_cows",
                "label": "Shuffle Cows",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "shuffle_beehives",
                "label": "Shuffle Beehives",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false,
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ]
            },
            {
                "name": "shuffle_kokiri_sword",
                "label": "Shuffle Kokiri Sword",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "shuffle_ocarinas",
                "label": "Shuffle Ocarinas",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "shuffle_gerudo_card",
                "label": "Shuffle Gerudo Card",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "shuffle_beans",
                "label": "Shuffle Magic Beans",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "shuffle_medigoron_carpet_salesman",
                "label": "Shuffle Medigoron & Carpet Salesman",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "shuffle_frog_song_rupees",
                "label": "Shuffle Frog Song Rupees",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            }
        ],
        "Misc.": [
            {
                "name": "ocarina_songs",
                "label": "Randomize Ocarina Song Notes",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "off",
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "frog",
                        "label": "Frog Songs Only"
                    },
                    {
                        "name": "warp",
                        "label": "Warp Songs Only"
                    },
                    {
                        "name": "all",
                        "label": "All Songs"
                    }
                ]
            },
            {
                "name": "correct_chest_appearances",
                "label": "Chest Appearance Matches Contents",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "off",
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "textures",
                        "label": "Texture"
                    },
                    {
                        "name": "both",
                        "label": "Both Size and Texture"
                    },
                    {
                        "name": "classic",
                        "label": "Classic"
                    }
                ]
            },
            {
                "name": "minor_items_as_major_chest",
                "label": "Minor Items in Big/Gold chests",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false,
                "prerequisite": [
                    {
                        "name": "correct_chest_appearances",
                        "value": ["textures", "both", "classic"]
                    }
                ]
            },
            {
                "name": "invisible_chests",
                "label": "Invisible Chests",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "correct_potcrate_appearances",
                "label": "Pot, Crate, & Beehive Appearance Matches Contents",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "textures_unchecked",
                "options": [
                    {
                        "name": "off",
                        "label": "Off"
                    },
                    {
                        "name": "textures_content",
                        "label": "Texture (Match Content)"
                    },
                    {
                        "name": "textures_unchecked",
                        "label": "Texture (Unchecked)"
                    }
                ]
            },
            {
                "name": "clearer_hints",
                "label": "Clearer Hints",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "hints",
                "label": "Gossip Stones",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "always",
                "options": [
                    {
                        "name": "none",
                        "label": "No Hints"
                    },
                    {
                        "name": "mask",
                        "label": "Hints; Need Mask of Truth"
                    },
                    {
                        "name": "agony",
                        "label": "Hints; Need Stone of Agony"
                    },
                    {
                        "name": "always",
                        "label": "Hints; Need Nothing"
                    }
                ]
            },
            {
                "name": "hint_dist",
                "label": "Hint Distribution",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "balanced",
                "options": [
                    {
                        "name": "balanced",
                        "label": "Balanced"
                    },
                    {
                        "name": "bingo",
                        "label": "Bingo"
                    },
                    {
                        "name": "chaos",
                        "label": "Chaos!!!"
                    },
                    {
                        "name": "coop2",
                        "label": "Co-op"
                    },
                    {
                        "name": "ddr",
                        "label": "DDR"
                    },
                    {
                        "name": "league",
                        "label": "League S3"
                    },
                    {
                        "name": "mw3",
                        "label": "MW Season 3"
                    },
                    {
                        "name": "scrubs",
                        "label": "Scrubs"
                    },
                    {
                        "name": "strong",
                        "label": "Strong"
                    },
                    {
                        "name": "tournament",
                        "label": "Tournament"
                    },
                    {
                        "name": "useless",
                        "label": "Useless"
                    },
                    {
                        "name": "very_strong",
                        "label": "Very Strong"
                    },
                    {
                        "name": "very_strong_magic",
                        "label": "Very Strong with Magic"
                    },
                    {
                        "name": "weekly",
                        "label": "Weekly"
                    }
                ]
            },
            {
                "name": "misc_hints",
                "label": "Misc. Hints",
                "type": "multi",
                "simple_shuffle": false,
                "default_value": [
                    "altar",
                    "ganondorf",
                    "warp_songs"
                ],
                "options": [
                    {
                        "name": "altar",
                        "label": "Temple of Time Altar",
                        "weight": 1
                    },
                    {
                        "name": "dampe_diary",
                        "label": "Dampé's Diary (Hookshot)",
                        "weight": 0
                    },
                    {
                        "name": "ganondorf",
                        "label": "Ganondorf (Light Arrows)",
                        "weight": 1
                    },
                    {
                        "name": "warp_songs",
                        "label": "Warp Songs",
                        "weight": 1
                    },
                    {
                        "name": "10_skulltulas",
                        "label": "House of Skulltula: 10",
                        "weight": 0
                    },
                    {
                        "name": "20_skulltulas",
                        "label": "House of Skulltula: 20",
                        "weight": 0
                    },
                    {
                        "name": "30_skulltulas",
                        "label": "House of Skulltula: 30",
                        "weight": 0
                    },
                    {
                        "name": "40_skulltulas",
                        "label": "House of Skulltula: 40",
                        "weight": 0
                    },
                    {
                        "name": "50_skulltulas",
                        "label": "House of Skulltula: 50",
                        "weight": 0
                    }
                ]
            },
            {
                "name": "text_shuffle",
                "label": "Text Shuffle",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "none",
                "options": [
                    {
                        "name": "none",
                        "label": "No Text Shuffled",
                        "weight": 1
                    },
                    {
                        "name": "except_hints",
                        "label": "Shuffled except Important Text",
                        "weight": 1
                    },
                    {
                        "name": "complete",
                        "label": "All Text Shuffled",
                        "weight": 0
                    }
                ]
            },
            {
                "name": "damage_multiplier",
                "label": "Damage Multiplier",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "normal",
                "options": [
                    {
                        "name": "half",
                        "label": "Half"
                    },
                    {
                        "name": "normal",
                        "label": "Normal"
                    },
                    {
                        "name": "double",
                        "label": "Double"
                    },
                    {
                        "name": "quadruple",
                        "label": "Quadruple"
                    },
                    {
                        "name": "ohko",
                        "label": "OHKO"
                    }
                ]
            },
            {
                "name": "deadly_bonks",
                "label": "Bonks Do Damage",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "none",
                "prerequisite": [
                    {
                        "name": "logic_rules",
                        "value": ["none", "glitchless"]
                    }
                ],
                "options": [
                    {
                        "name": "none",
                        "label": "No Damage"
                    },
                    {
                        "name": "half",
                        "label": "Quarter Heart"
                    },
                    {
                        "name": "normal",
                        "label": "Half Heart"
                    },
                    {
                        "name": "double",
                        "label": "Whole Heart"
                    },
                    {
                        "name": "quadruple",
                        "label": "Two Hearts"
                    },
                    {
                        "name": "ohko",
                        "label": "One Bonk KO"
                    }
                ]
            },
            {
                "name": "no_collectible_hearts",
                "label": "Hero Mode",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            },
            {
                "name": "starting_tod",
                "label": "Starting Time of Day",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "default",
                "options": [
                    {
                        "name": "default",
                        "label": "Default (10:00)"
                    },
                    {
                        "name": "random",
                        "label": "Random Choice"
                    },
                    {
                        "name": "sunrise",
                        "label": "Sunrise (6:30)"
                    },
                    {
                        "name": "morning",
                        "label": "Morning (9:00)"
                    },
                    {
                        "name": "noon",
                        "label": "Noon (12:00)"
                    },
                    {
                        "name": "afternoon",
                        "label": "Afternoon (15:00)"
                    },
                    {
                        "name": "sunset",
                        "label": "Sunset (18:00)"
                    },
                    {
                        "name": "evening",
                        "label": "Evening (21:00)"
                    },
                    {
                        "name": "midnight",
                        "label": "Midnight (00:00)"
                    },
                    {
                        "name": "witching-hour",
                        "label": "Witching Hour (03:00)"
                    }
                ]
            },
            {
                "name": "blue_fire_arrows",
                "label": "Blue Fire Arrows",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": true
            },
            {
                "name": "fix_broken_drops",
                "label": "Fix Broken Drops",
                "type": "binary",
                "simple_shuffle": false,
                "default_value": false
            }
        ],
        "Item Pool": [
            {
                "name": "item_pool_value",
                "label": "Item Pool",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "balanced",
                "options": [
                    {
                        "name": "ludicrous",
                        "label": "Ludicrous"
                    },
                    {
                        "name": "plentiful",
                        "label": "Plentiful"
                    },
                    {
                        "name": "balanced",
                        "label": "Balanced"
                    },
                    {
                        "name": "scarce",
                        "label": "Scarce"
                    },
                    {
                        "name": "minimal",
                        "label": "Minimal"
                    }
                ]
            },
            {
                "name": "junk_ice_traps",
                "label": "Ice Traps",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "normal",
                "options": [
                    {
                        "name": "off",
                        "label": "No Ice Traps"
                    },
                    {
                        "name": "normal",
                        "label": "Normal Ice Traps"
                    },
                    {
                        "name": "on",
                        "label": "Extra Ice Traps"
                    },
                    {
                        "name": "mayhem",
                        "label": "Ice Trap Mayhem"
                    },
                    {
                        "name": "onslaught",
                        "label": "Ice Trap Onslaught"
                    }
                ]
            },
            {
                "name": "ice_trap_appearance",
                "label": "Ice Trap Appearance",
                "type": "radio",
                "simple_shuffle": false,
                "default_value": "major_only",
                "options": [
                    {
                        "name": "major_only",
                        "label": "Major Items Only"
                    },
                    {
                        "name": "junk_only",
                        "label": "Junk Items Only"
                    },
                    {
                        "name": "anything",
                        "label": "Anything"
                    }
                ]
            },
            {
                "name": "adult_trade_start",
                "label": "Adult Trade Sequence Items",
                "type": "multi",
                "simple_shuffle": false,
                "default_value": [
                    "Pocket Egg",
                    "Pocket Cucco",
                    "Cojiro",
                    "Odd Mushroom",
                    "Poachers Saw",
                    "Broken Sword",
                    "Prescription",
                    "Eyeball Frog",
                    "Eyedrops",
                    "Claim Check"
                ],
                "options": [
                    {
                        "name": "Pocket Egg",
                        "label": "Pocket Egg"
                    },
                    {
                        "name": "Pocket Cucco",
                        "label": "Pocket Cucco"
                    },
                    {
                        "name": "Cojiro",
                        "label": "Cojiro"
                    },
                    {
                        "name": "Odd Mushroom",
                        "label": "Odd Mushroom"
                    },
                    {
                        "name": "Poachers Saw",
                        "label": "Poacher's Saw"
                    },
                    {
                        "name": "Broken Sword",
                        "label": "Broken Sword"
                    },
                    {
                        "name": "Prescription",
                        "label": "Prescription"
                    },
                    {
                        "name": "Eyeball Frog",
                        "label": "Eyeball Frog"
                    },
                    {
                        "name": "Eyedrops",
                        "label": "Eyedrops"
                    },
                    {
                        "name": "Claim Check",
                        "label": "Claim Check"
                    }
                ]
            }
        ]
    };
    
    self.allWeights = {};
    // This object only exists for convenience. It makes lookups much easier.
    self.flatSettings = {};

    // Try to restore locally stored information.
    let settingsRestored = self.restoreSettings();

    // Apply default weights to all settings that don't already have them. Also
    // add all settings to our master object (which will make the data binding
    // much easier.)
    for (const category in self.allSettings) {
        for (const setting of self.allSettings[category]) {
            self.flatSettings[setting["name"]] = setting;

            // If settings were already restored, don't apply weights.
            if (settingsRestored) continue;

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
        return plandoObject;
    };

    self.saveSettings = function saveSettings() {
        localStorage.setItem('weights', JSON.stringify(self.allWeights));
        localStorage.setItem('simple_settings', self.simpleSettings);
        localStorage.setItem('critical_hints_on', self.criticalHintsOn);
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