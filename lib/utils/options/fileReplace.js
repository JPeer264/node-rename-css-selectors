'use strict';
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
 * @param  {Object} options
 * @property {String}   regex       a regular expression
 * @property {String}   prefix      the prefix for renaming
 * @property {Boolean}  isSelectors a boolean to get new values for the selectorLibrary
 *
 * @return {Object}
 */
fileReplace.replace = (options) => {

    /**
     * @todo  get values from the selectorsLibrary - bail if empty
     * @todo  open files and replace it in the file
     * @todo  if isSelectors is enabled save the orig value for saving it into the library
     */

    return {
        filename: '',
        filetype: '',
        prefix: '',
        selectors: { // just if isSelectors is enabled (for CSS files)
            orig: '',
            new: ''
        }
    };
};

/**
 * special replacements for css files - needs to store files in the selectorLibrary
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
fileReplace.replaceCss = (options) => {

    /**
     * @todo  replace css files
     * @todo  set isSelectors in options to true
     * @todo  get return values and save it into the library
     */

};
