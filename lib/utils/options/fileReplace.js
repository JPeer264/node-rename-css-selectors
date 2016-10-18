'use strict';

const fs = require('fs');

/**
 * parses through every single document and renames the names
 * (require(hasten)).fileReplace
 *
 * @module fileReplace
 */
const fileReplace = module.exports = {};

/**
 * Parse a file and returns new selectors if the option 'isSelectors' is set to true
 *
 * @param  {String} filepath        the file's path to change
 * @param  {Object} options
 * @property {String}   regex       a regular expression
 * @property {String}   prefix      the prefix for renaming
 * @property {Boolean}  isSelectors a boolean to get new values for the selectorLibrary
 * @param  {Object} cb              the callback
 *
 * @return {Object}
 */
fileReplace.replace = (filepath, options, cb) => {

    fs.readFile(filepath, 'utf8', (err, data) => {

        var result = data.match(/(\.|#)[^\s:\.\)]+/g);

        console.log(result)

        return cb(err, result);
    });

    /**
     * @todo  get values from the selectorsLibrary - bail if empty
     * @todo  open files and replace it in the file
     * @todo  if isSelectors is enabled save the orig value for saving it into the library
     * REGEX  /(\.|#)[^\s:\.\)]+/g
     * matches from . or # every character until : or . or ) (for pseudo elements or dots or even in :not(.class))
     */

    // return {
        // filename: '',
        // filetype: '',
        // prefix: '',
        // selectors: { // just if isSelectors is enabled (for CSS files)
        //     type: 'id|class'
        //     orig: '',
        //     new: ''
        // }
    // };
};

/**
 * special replacements for css files - needs to store files in the selectorLibrary
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
fileReplace.replaceCss = (filepath, options, cb) => {

    /**
     * @todo  replace css files
     * @todo  set isSelectors in options to true
     * @todo  get return values and save it into the library
     */

};
