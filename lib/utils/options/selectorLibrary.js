'use strict';

/**
 * @todo  get() minified or original selector
 */
class SelectorLibrary {
    constructor() {
        this.selectors = {};
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

        if (typeof value === 'object') {
            for (let i = 0; i < value.length; i++) {
                if (this.get(value) !== value) {
                    return;
                }

                selectorObject = this.setValue(value[i]);
                selectorLibrarySelector = value[i].slice(1, value[i].length);

                this.selectors[selectorLibrarySelector] = this.setValue(value[i]);
            }

            return;
        }

        if (this.get(value) !== value) {
            return;
        }

        selectorObject = this.setValue(value);
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

        type               = string.charAt(0) === '.' ? 'class' : 'id';
        selector           = string;
        compressedSelector = 'a1';

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
