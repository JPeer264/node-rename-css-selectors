'use strict';

const rcs = require('../rcs');

/**
 * a library holding all information about the selectors including its old states
 */
class SelectorLibrary {
    constructor() {
        this.selectors = {};
        this.created
    }

    /**
     * gets a specific selector
     *
     * @param {String} the selector
     * @return {String}
     */
    get(selector) {
        let result = selector.replace(/(\.|#)/, ''); // replaces the first character from a css selector `#test` and `.test` into `test`

        if (this.selectors[result] === undefined) {
            return selector;
        }

        return this.selectors[result].compressedSelector;
    }

    /**
     * gets all selectors
     *
     * @return {[type]} [description]
     */
    getAll() {
        return this.selctors;
    }

    /**
     * sets new values in the selector library
     *
     * @param {String | Array} value this could be either a css selector or an array of css selectors
     */
    set(value) {
        let selectorObject;
        let selectorLibrarySelector;

        // loops through String.match array
        if (typeof value === 'object') {
            for (let i = 0; i < value.length; i++) {
                // checks if this value was already set
                if (this.get(value[i]) !== value[i]) {
                    return;
                }

                selectorLibrarySelector = value[i].slice(1, value[i].length);

                this.selectors[selectorLibrarySelector] = this.setValue(value[i]);
            }

            return;
        }

        // checks if this value was already set
        if (this.get(value) !== value) {
            return;
        }

        selectorLibrarySelector = value.slice(1, value.length);

        this.selectors[selectorLibrarySelector] = this.setValue(value);
    }

    /**
     * creates a new object to set it into the selector library
     *
     * @todo  get a new compressedSelector
     *
     * @param {String} string the selector string
     * @return {Object} the object to set it into the set method
     */
    setValue(string) {
        let type;
        let selector;
        let compressedSelector;
        let selectorLibrarySelector = string.slice(1, string.length);

        // return the own value if it exists
        if (this.selectors[selectorLibrarySelector] !== undefined) {
            return this.selectors[selectorLibrarySelector];
        }

        type               = string.charAt(0) === '.' ? 'class' : 'id';
        selector           = string;
        compressedSelector = rcs.nameGenerator.generate();

        return {
            type: type,
            selector: selector,
            compressedSelector: compressedSelector
        };
    }

    /**
     * generates a file including all old and new selectors/names
     * includes also unused class selectors
     */
    generateLibraryFile() {
    }
};

/**
 * creates a new selectorLibrary
 * (require(hasten)).selectorLibrary
 *
 * @module selectorLibrary
 */
exports = module.exports = new SelectorLibrary();
