// global variables
// UI component control
var sidebar_loc = "-550px";
var ud_offset = 50;

// map configurations
var map_center = {
    // ** San Francisco **
    // "lat": 37.7749,
    // "lon": -122.4194
    // ** Los Angeles **
    "lat": 34.0522,
    "lon": -118.2437
};

// chart configurations
// Word Cloud Chart
var pos_gauge = {
    backgroundColor: "white",
    waveAnimateTime: 2000,
    waveHeight: 0.3,
    waveCount: 1,
    valueCountUpAtStart: false,
    waveRiseAtStart: false
};
var neg_gauge = {
    circleColor: "#FF7777",
    textColor: "#FF4444",
    waveTextColor: "#FFAAAA",
    waveColor: "#FF7777",
    backgroundColor: "white",
    waveAnimateTime: 2000,
    waveHeight: 0.3,
    waveCount: 1,
    valueCountUpAtStart: false,
    waveRiseAtStart: false
};
var neu_gauge = {
    circleColor: "#3CA55C",
    textColor: "#3C7229",
    waveTextColor: "#3CD88F",
    waveColor: "#3CA55C",
    backgroundColor: "white",
    waveAnimateTime: 2000,
    waveHeight: 0.3,
    waveCount: 1,
    valueCountUpAtStart: false,
    waveRiseAtStart: false
};
var mix_gauge = {
    circleThickness: 0.4,
    circleColor: "#6DA398",
    textColor: "#0E5144",
    waveTextColor: "#6DA398",
    waveColor: "#246D5F",
    textVertPosition: 0.52,
    waveAnimateTime: 5000,
    waveHeight: 0,
    waveAnimate: false,
    waveCount: 2,
    waveOffset: 0.25,
    textSize: 1.2,
    // minValue: 30,
    // maxValue: 150,
    // displayPercent: false
};

// NLP variables
// for Compromise lib.
// black list for finding adj. in a sentence.
var nlp_config = {
    "adj_blacklist": [
        'all', 'even', 'other',
        'true', 'false',
        'south', 'north', 'east', 'west',
        'right', 'left', 'down', 'up',
    ]
};
// for Compendium lib.
// default configuration for the thermometer
var th_config = {
    totalCount: 100, totalCountLabel: "", usedCount : 0, usedCountLabel:"", usedPercentageLabel: "",
    levels: [
        {threshold: -100, colour: "#3f3f3f"}, // base level
        {threshold: 0, colour: "#3f3f3f"}, // base level
        {threshold: 20, colour: "#64B9E7"},
        {threshold: 40, colour: "#94d095"},
        {threshold: 60, colour: "#ffddcc"},
        {threshold: 80, colour: "#ffddee"}
    ]
};
// part-of-speech tags definition
var post_def = {
    "CC": { "meaning": "Coord Conjuncn", "ex": "and | but | or" },
    "CD": { "meaning": "Cardinal number", "ex": "one | two | 1 | 2" },
    "DT": { "meaning": "Determiner", "ex": "the | some" },
    "EX": { "meaning": "Existential there", "ex": "there" },
    "FW": { "meaning": "Foreign word", "ex": "mon dieu" },
    "IN": { "meaning": "Preposition", "ex": "of | in | by" },
    "JJ": { "meaning": "Adjective", "ex": "big" },
    "JJR": { "meaning": "Comparative adjective", "ex": "bigger" },
    "JJS": { "meaning": "Superlative adjective", "ex": "biggest" },
    "LS": { "meaning": "List item marker", "ex": "1 | One" },
    "MD": { "meaning": "Modal", "ex": "can | should" },
    "NN": { "meaning": "Noun; sing. or mass", "ex": "dog" },
    "NNP": { "meaning": "Proper noun or sing.", "ex": "Edinburgh" },
    "NNPS": { "meaning": "Plural proper noun", "ex": "Smiths" },
    "NNS": { "meaning": "Plural noun", "ex": "dogs" },
    "PDT": { "meaning": "Predeterminer", "ex": "all | both" },
    "POS": { "meaning": "Possessive ending", "ex": "\'s" },
    "PP": { "meaning": "Personal pronoun", "ex": "I | you | she" },
    "PRP\$": { "meaning": "Possessive pronoun", "ex": "my | one\'s" },
    "RB": { "meaning": "Adverb", "ex": "quickly | not" },
    "RBR": { "meaning": "Comparative adverb", "ex": "faster" },
    "RBS": { "meaning": "Superlative adverb", "ex": "fastest" },
    "RP": { "meaning": "Particle", "ex": "up | off" },
    "SYM": { "meaning": "Symbol", "ex": "+ | % | &" },
    "TO": { "meaning": "\'to\'", "ex": "to" },
    "UH": { "meaning": "Interjection", "ex": "oh | oops" },
    "VB": { "meaning": "Verb \(base form\)", "ex": "eat" },
    "VBD": { "meaning": "Verb \(past tense\)", "ex": "ate" },
    "VBG": { "meaning": "Verb \(gerund\)", "ex": "eating" },
    "VBN": { "meaning": "Verb \(past part\)", "ex": "eaten" },
    "VBP": { "meaning": "Verb \(present\)", "ex": "eat" },
    "VBZ": { "meaning": "Verb \(present\)", "ex": "eats" },
    "WDT": { "meaning": "Wh-determiner", "ex": "which | that" },
    "WP": { "meaning": "Wh pronoun", "ex": "who | what" },
    "WP\$": { "meaning": "Possessive-Wh", "ex": "whose" },
    "WRB": { "meaning": "Wh-adverb", "ex": "how | where" }
};

// example for MongoDB query function call:
/*
    mdb_query( "business", {}, { "business_id": 1 } ).then( function( data )
    {   // Run this when your request was successful
        console.log( data )
    }).catch( function( err )
    {   // Run this when promise was rejected via reject()
        console.log( err )
    });
 */