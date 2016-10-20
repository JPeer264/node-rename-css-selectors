'use strict';

const rcs = require('../rcs');

/**
 * a library holding all information about the selectors including its old states
 */
class SelectorLibrary {
    constructor() {
        this.selectors           = {};
        this.compressedSelectors = {};
        this.created
    }

    /**
     * gets a specific selector
     *
     * @param {String} the selector
     * @return {String}
     */
    get(selector, options) {
        // @todo set options with isSelectors
        let matchedSelector = selector.replace(/(\.|#)/, ''); // replaces the first character from a css selector `#test` and `.test` into `test`
        let result          = this.selectors[matchedSelector];;

        // set options if its is not set or is not an object
        options = !options && typeof options !== 'object' ? {} : options;


        // set default parameters if they are not set in the options
        options.isCompressed = typeof options.isCompressed !== 'undefined' ? options.isCompressed : true; // default true
        options.isSelectors  = typeof options.isSelectors !== 'undefined' ? options.isSelectors : false; // default false
        options.origValues   = typeof options.origValues !== 'undefined' ? options.origValues : true; // default true

        // change the objects if origValues are set to false - to get information about the compressed selectors
        if (!options.origValues) {
            result = this.compressedSelectors[matchedSelector];
        }

        if (result === undefined) {
            return selector;
        }

        if (options.isCompressed) {
            if (options.isSelectors) {
                return result.typeChar + result.compressedSelector;
            }

            return result.compressedSelector;
        }

        return result;
    }

    /**
     * gets all selectors
     *
     * @param {Boolean} [origValues=true]
     * @param {Boolean} [makeRegex=false] should return a regex string
     * @return {Object} returns this.selectors
     */
    getAll(options) {
        let regex;
        let selector;
        let selectors;
        let compressedSelector;
        let originalSelector;
        let result      = {};
        let resultArray = [];

        // set options if its is not set or is not an object
        options = !options && typeof options !== 'object' ? {} : options;

        // set default parameters if they are not set in the options
        options.origValues  = typeof options.origValues !== 'undefined' ? options.origValues : true; // default true
        options.regex       = typeof options.regex !== 'undefined' ? options.regex : false; // default false
        options.isSelectors = typeof options.isSelectors !== 'undefined' ? options.isSelectors : false; // default false

        selectors = this.selectors;

        for (selector in selectors) {
            compressedSelector = selectors[selector].compressedSelector;
            originalSelector   = selector;

            if (options.origValues) { // save originalSelectors
                result[selector] = compressedSelector
                resultArray.push(originalSelector);
            } else { // save compressedSelectors
                result[compressedSelector] = originalSelector;
                resultArray.push(compressedSelector);
            }
        }

        // sort array by it's length to avoid e.g. BEM syntax
        resultArray = resultArray.sort((a, b) => {
            return b.length - a.length;
        });

        if (options.isSelectors) {
            resultArray = resultArray.map(value => {
                let selectorMap = this.get(value, {
                    origValues: options.origValues,
                    isSelectors: options.isSelectors,
                    isCompressed: false
                });

                return selectorMap.typeChar + value;
            });
        }

        // console.log(resultArray);

        // return a new regex
        if (options.regex) {
            regex = resultArray.length === 0 ? undefined : new RegExp(resultArray.join("|"), 'g');

            return regex;
        }

        return result;
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
                    continue;
                }

                selectorLibrarySelector = value[i].slice(1, value[i].length);

                // save into this.selectors and this.compressedSelectors
                this.selectors[selectorLibrarySelector] = this.setValue(value[i]);
                this.compressedSelectors[this.selectors[selectorLibrarySelector].compressedSelector] = this.selectors[selectorLibrarySelector];
            }

            return;
        }

        // checks if this value was already set
        if (this.get(value) !== value) {
            return;
        }

        selectorLibrarySelector = value.slice(1, value.length);

        // save into this.selectors and this.compressedSelectors
        this.selectors[selectorLibrarySelector] = this.setValue(value);
        this.compressedSelectors[this.selectors[selectorLibrarySelector].compressedSelector] = this.selectors[selectorLibrarySelector];

        return;
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
        let typeChar;
        let compressedSelector;
        let selectorLibrarySelector = string.slice(1, string.length);

        // return the own value if it exists
        if (this.selectors[selectorLibrarySelector] !== undefined) {
            return this.selectors[selectorLibrarySelector];
        }

        type               = string.charAt(0) === '.' ? 'class' : 'id';
        typeChar           = string.charAt(0);
        selector           = string;
        compressedSelector = rcs.nameGenerator.generate();

        return {
            type: type,
            typeChar: typeChar,
            selector: selector,
            modifiedSelector: selectorLibrarySelector,
            compressedSelector: compressedSelector
        };
    }

    /**
     * generates a file including all old and new selectors/names
     * includes also unused class selectors
     */
    generateLibraryFile() {
        // @todo  available options
        //        savePath
        //        justIds?
        //        justClasses?
        // @todo  get all selectors
        // @todo  save file into path
    }
};

/**
 * creates a new selectorLibrary
 * (require(hasten)).selectorLibrary
 *
 * @module selectorLibrary
 */
exports = module.exports = new SelectorLibrary();
