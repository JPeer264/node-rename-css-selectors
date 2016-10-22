'use strict';

const _   = require('lodash');
const fs  = require('fs');
const rcs = require('../rcs');

/**
 * parses through every single document and renames the names
 * (require(rcs)).fileReplace
 *
 * @module fileReplace
 */
const fileReplace = module.exports = {};

/**
 * Parse a file and returns new selectors if the option 'isSelectors' is set to true
 *
 * @param  {String} filepath    the file's path to change
 * @param  {Object} [options]
 * @property {String}   regex               a regular expression
 * @property {String}   prefix              the prefix for renaming
 * @property {Boolean}  [isSelectors=false] a boolean to get new values for the selectorLibrary
 * @param  {Object} cb          the callback
 *
 * @return {Object}
 */
fileReplace.replace = (filepath, options, cb) => {
    const optionsDefault = {
        prefix: '',
        regex: rcs.selectorLibrary.getAll({
            origValue: true,
            regex: true,
            isSelectors: false
        })
    };

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    // file does not exist | bail
    if (!fs.existsSync(filepath)) {
        cb ({
            message: 'File does not exist',
            error: 'ENOENT'
        });
    }

    options = _.merge(optionsDefault, options);

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return cb(err);

        data = data.replace(options.regex, getSelector);

        return cb(null, data);
    });

    /**
     * calls the rcs.selectorLibrary.get internally
     * String.replace will call this function and get call rcs.selectorLibrary.get directly
     *
     * @param  {String} match
     * @return {String} rcs.selectorLibrary.get()
     */
    function getSelector(match) {
        let result = rcs.selectorLibrary.get(match);

        return result;
    }
};

/**
 * special replacements for css files - needs to store files in the selectorLibrary
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
fileReplace.replaceCss = (filepath, options, cb) => {
    // matches from . or # every character until : or . or ) (for pseudo elements or dots or even in :not(.class))
    let regex  = /(#|\.)[^\s:\.\{)]+/g;

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    // file does not exist | bail
    if (!fs.existsSync(filepath)) {
        cb ({
            message: 'File does not exist',
            error: 'ENOENT'
        });
    }

    fs.readFile(filepath, 'utf8', (err, data) => {
        rcs.selectorLibrary.set(data.match(regex));

        options.regex = rcs.selectorLibrary.getAll({
            origValues: true,
            regex: true,
            isSelectors: true
        });

        data = data.replace(options.regex, getCssSelector);

        return cb(null, data);
    });

    /**
     * calls the rcs.selectorLibrary.get internally
     * String.replace will call this function and get call rcs.selectorLibrary.get directly
     *
     * @param  {String} match
     * @return {String} rcs.selectorLibrary.get()
     */
    function getCssSelector(match) {
        let result = rcs.selectorLibrary.get(match, {
            isSelectors: true
        });

        return result;
    }
};
