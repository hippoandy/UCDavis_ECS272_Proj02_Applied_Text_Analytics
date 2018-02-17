// global variables
var center_lat = 37.7749;
var center_lon = -122.4194;
var sidebar_loc = "-550px";
var ud_offset = 50;

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
}




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