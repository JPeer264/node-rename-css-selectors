'use strict';

const rcs = require('../rcs');
const _   = require('lodash');

/**
 * a library holding all information about the selectors including its old states
 */
class SelectorLibrary {
    constructor() {
        this.excludes            = [];
        this.selectors           = {};
        this.compressedSelectors = {};
    }

    /**
     * Checks wheter an array contains a specific value
     * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
     *
     * @param  {String} needle the value searching for
     *
     * @return {Boolean}
     */
    contains(needle) {
        let n;
        let k;
        let currentElement;

        const O   = Object(this);
        const len = parseInt(O.length, 10) || 0;

        if (len === 0) {
          return false;
        }

        n = parseInt(arguments[1], 10) || 0;

        if (n >= 0) {
            k = n;
        } else {
            k = len + n;

            if (k < 0) {
                k = 0;
            }
        }

        while (k < len) {
            currentElement = O[k];

            if (needle === currentElement || (needle !== needle && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }

            k++;
        }

        return false;
    } // /contains

    /**
     * gets a specific selector
     *
     * @param {String} the selector
     * @return {String}
     */
    get(selector, options) {
        // @todo set options with isSelectors
        let matchedSelector = selector.replace(/(\.|#)/, ''); // replaces the first character from a css selector `#test` and `.test` into `test`
        let result          = this.selectors[matchedSelector];

        const optionsDefault = {
            origValues: true,
            isSelectors: false,
            isCompressed: true
        }

        options = _.merge(optionsDefault, options);

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
    } // /get

    /**
     * @typedef {Object} getAllOptions
     * @property {Boolean} [origValues=true]    if it should return the original values or the compressed one
     * @property {Boolean} [regex=false]        if it should return a regex string
     * @property {Boolean} [isSelectors=false]  true appends appends the # for IDs or . for Classes
     * @property {Boolean} [extended=false]     extend the normal return value with metadata - has NO EFFECT in combination with REGEX
     */
    /**
     * gets all selectors
     *
     * @param {getAllOptions} [options]
     *
     * @return {String | Object} returns either a regex string or an object with elements, depends on the setted options
     */
    getAll(options) {
        let regex;
        let selector;
        let originalSelector;
        let compressedSelector;
        let selectors   = this.selectors;
        let result      = {};
        let resultArray = [];

        const optionsDefault = {
            origValues: true,
            regex: false,
            isSelectors: false,
            extended: false,
            regexCss: false
        }

        options   = _.merge(optionsDefault, options);

        if (!options.extended) {
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
            if (options.regex || options.regexCss) {
                resultArray = resultArray.sort((a, b) => {
                    return b.length - a.length;
                });
            }

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

            // return a new regex
            if (options.regexCss) {
                regex = resultArray.length === 0 ? undefined : new RegExp(resultArray.join("|"), 'g');

                return regex;
            }

            // return a new regex
            if (options.regex) {
                regex = resultArray.length === 0 ? undefined : new RegExp("(\\s|\\s\\.|#)(" + resultArray.join("|") + ")\\s", 'g')

                return regex;
            }

            return result;
        } // !options.extended

        // reset result
        result = {};

        if (options.origValues) {
            result = this.selectors;
        } else {
            result = this.compressedSelectors;
        }

        if (options.isSelectors) {
            let modifiedResult = {};

            for (let value in result) {
                if (result.hasOwnProperty(value)) {
                    let char = result[value].typeChar;

                    modifiedResult[char + value] = result[value];
                }
            }

            result = modifiedResult;
        }

        return result;
    } // /getAll

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

                if (this.contains.call(this.excludes, value[i])) {
                    continue;
                }

                selectorLibrarySelector = value[i].replace(/(\.|#)/g, '');

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

        if (this.contains.call(this.excludes, value)) {
            return;
        }

        selectorLibrarySelector = value.slice(1, value.length);

        // save css selector into this.selectors and this.compressedSelectors
        this.selectors[selectorLibrarySelector] = this.setValue(value);
        this.compressedSelectors[this.selectors[selectorLibrarySelector].compressedSelector] = this.selectors[selectorLibrarySelector];

        return;
    } // /set

    /**
     * excludes css selectors and stores it into this.excludes
     *
     * @param {String | Array} toExclude a string or array with string to exclude specific css selectors
     */
    setExclude(toExclude) {
        if (!toExclude) return;

        if (typeof toExclude === 'string') {
            (this.excludes).push(toExclude);

            return;
        }

        for (let e of toExclude) {
            (this.excludes).push(e);
        }
    } // /setExclude

    /**
     * creates a new object to set it into the selector library
     *
     * @param {String} string the selector string
     *
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
    } // /setValue
};

/**
 * creates a new selectorLibrary
 * (require(hasten)).selectorLibrary
 *
 * @module selectorLibrary
 */
exports = module.exports = new SelectorLibrary();
