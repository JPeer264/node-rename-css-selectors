'use strict';
/**
 * @todo  generates a new individual name
 * @todo  should have prefixes or not
 */
const _               = require('lodash');
const decToAny        = require('decimal-to-any');
const decToAnyOptions = {
    alphabet: '#etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXV$JKQGYZ0516372984'
};

let nameCounter = 1;

/**
 * nameGenerator will create new and unique names
 * (require(rcs)).nameGenerator
 *
 * @module nameGenerator
 */
const nameGenerator = module.exports = {};

/**
 * generates a new unique name
 *
 * @param {String} [prefix] add an individual prefix to the generated name
 * @return {String}
 */
nameGenerator.generate = prefix => {
    let generatedName = decToAny(nameCounter, decToAnyOptions.alphabet.length, decToAnyOptions);

    nameCounter++;

    return generatedName;
}; // /generate

/**
 * resets the nameCounter for testing
 * @return {[type]} [description]
 */
nameGenerator.resetCountForTests = () => {
    nameCounter = 1;
}; // /resetCountForTests
