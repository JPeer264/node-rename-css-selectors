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
        return selector;
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
