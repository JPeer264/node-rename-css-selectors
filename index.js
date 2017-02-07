'use strict';

const rcs   = require('rcs-core');
const fs    = require('fs-extra');
const path  = require('path');
const glob  = require('glob');
const json  = require('json-extra');
const async = require('async');
const _     = require('lodash');

/**
 * parses through every single document and renames the names
 *
 * @module renameCssSelectors
 */
const renameCssSelectors = module.exports = {};

/**
 * @typedef {Object} processOptions
 * @property {Boolean}  [collectSelectors=false]    if the triggered files are css files
 * @property {Boolean}  [overwrite=false]           overwrite the same file
 * @property {String}   [cwd=process.cwd()]         the current working directory in which to search
 * @property {String}   [newPath='rcs']             in which folder the new files should go
 * @property {Boolean}  [flatten=false]             flatten the hierarchy - no subfolders
 */
/**
 * process over all files - set and replace
 *
 * @param  {pathString}         pathString this pathString can be either an expression for `glob` or a filepath
 * @param  {processOptions}     options
 * @param  {Function} cb        the callback
 * @return {Function} cb
 */
renameCssSelectors.process = (pathString, options, cb) => {
    const optionsDefault = {
        collectSelectors: false,
        overwrite: false,
        cwd: process.cwd(),
        newPath: 'rcs',
        flatten: false
    };

    let globString = pathString;

    // @todo add flatten files

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    options = _.merge(optionsDefault, options);

    if (Object.prototype.toString.call(pathString) === '[object Array]') {
        globString = `{${ pathString.join(',') }}`;
    }

    glob(globString, {
        cwd: options.cwd
    }, (err, filesArray) => {
        if (err) return cb(err);

        // fail if nothing is found
        if (filesArray.length <= 0) {
            return cb({
                message: 'No files found',
                error: 'ENOENT'
            });
        }

        // call replaceCss if options.collectSelectors is set to true
        if (options.collectSelectors) {
            // call in series
            // not all selectors are stored, maybe some selectors are duplicated in different files
            async.eachSeries(filesArray, (filePath, callback) => {
                rcs.replace.fileCss(path.join(options.cwd, filePath), options, (err, data) => {
                    let joinedPath;
                    let shouldOverwrite = options.overwrite;

                    if (err) callback(err);

                    joinedPath = path.join(options.newPath, filePath);

                    if (!options.overwrite) {
                        shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
                    }

                    rcs.helper.save(joinedPath, data.data, { overwrite: shouldOverwrite }, (err) => {
                        if (err) callback(err);

                        callback();
                    });
                });
            }, err => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, true);
                }
            });
        } else {
            // can be fired asynchronous
            // all selectors are collected
            // ⚡️ speed it up with async ⚡️
            async.each(filesArray, (filePath, callback) => {
                rcs.replace.file(path.join(options.cwd, filePath), (err, data) => {
                    let joinedPath;
                    let shouldOverwrite = options.overwrite;

                    if (err) callback(err);

                    joinedPath = path.join(options.newPath, filePath);

                    if (!options.overwrite) {
                        shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
                    }

                    rcs.helper.save(joinedPath, data.data, { overwrite: shouldOverwrite }, (err) => {
                        if (err) callback(err);

                        callback();
                    });
                });
            }, err => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, true);
                }
            });
        }
    });
}; // /process

/**
 * process over all css files - set and replace
 * does exactly the same as renameCssSelectors.process, but set the collectSelectors option to true
 *
 * @param  {pathString}         pathString this pathString can be either an expression for `glob` or a filepath
 * @param  {processOptions}     options
 * @param  {Function} cb        the callback
 * @return {Function} cb
 */
renameCssSelectors.processCss = (pathString, options, cb) => {
    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    // set the css power for renameCssSelectors.process
    options.collectSelectors = true;

    renameCssSelectors.process(pathString, options, cb);
} // /processCss

/**
 * @typedef {Object} generateMappingOptions
 * @property {Boolean | String} [cssMapping=true]       true will generate the css mapping. A string will generate the css mapping file and the object is called like the string
 * @property {Boolean | String} [cssMappingMin=false]   like the property cssMapping
 * @property {Boolean} [extended=false]                 defines if metadata should be added to the selector
 * @property {Boolean} [json=false]                     defines if metadata should be added to the selector
 */
/**
 * generates a file including all old and new selectors/names
 * includes also unused class selectors
 *
 * @todo  generrate a json config file
 *
 * @param {String} pathString where it should get saved
 * @param {generateMappingOptions} [options]
 */
renameCssSelectors.generateMapping = (pathString, options, cb) => {
    let newPath     = path.join(pathString, 'renaming_map');
    let mappingName = 'CSS_NAME_MAPPING';
    let fileNameExt = '.json';

    const optionsDefault = {
        cssMapping: true,
        cssMappingMin: false,
        extended: false,
        json: true,
        origValues: true,
        isSelectors: true,
        overwrite: false
    }

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    options = _.merge(optionsDefault, options);

    if (options.cssMappingMin) {
        options.origValues = false;
        newPath = path.join(pathString, 'renaming_map_min');
        mappingName = 'CSS_NAME_MAPPING_MIN';
    }

    if (typeof options.cssMappingMin === 'string') {
        mappingName = options.cssMappingMin;
    }

    if (typeof options.cssMapping === 'string') {
        mappingName = options.cssMapping;
    }

    const cssMappingArray = rcs.selectorLibrary.getAll({
        extended: options.extended,
        origValues: options.origValues,
        isSelectors: options.isSelectors
    });

    let cssMappingJsonString = rcs.helper.objectToJson(cssMappingArray);
    let writeData = cssMappingJsonString;

    // no json
    if (!options.json) {
        writeData   = `var ${ mappingName } = ${ cssMappingJsonString };`
        fileNameExt = '.js';
    }

    rcs.helper.save(`${ newPath }${ fileNameExt }`, writeData, { overwrite: options.overwrite }, (err, data) => {
        if (err) cb(err);

        cb(null, data);
    });
}; // /generateMapping

renameCssSelectors.loadMapping = (pathString, options) => {
    let selectors = pathString;

    const optionsDefault = {
        origValues: true
    }

    options = options || {};
    options = _.merge(optionsDefault, options);

    if (typeof pathString === 'string') {
        selectors = json.readToObjSync(pathString, 'utf8');
    }

    if (!options.origValues) {
        let tempSelectors = {};

        for (let key in selectors) {
            let value = selectors[key];
            let modKey = key.slice(1, key.length);

            tempSelectors[key.charAt(0) + value] = modKey;
        }

        selectors = tempSelectors;
    }

    if (!selectors || typeof selectors !== 'object') {
        return;
    }

    rcs.selectorLibrary.setValues(selectors);
}; // /loadMapping

/**
 * includes .rcsrc - if not found it will include "rcs" in package.json
 */
renameCssSelectors.includeConfig = (pathString) => {
    let configObject;

    pathString   = pathString || path.join(process.cwd(), '.rcsrc');
    configObject = json.readToObjSync(pathString);

    if (!configObject) {
        // package.json .rcs if no other config is found
        configObject = json.readToObjSync(path.join(process.cwd(), 'package.json')).rcs;
    }

    if (configObject.exclude) {
        rcs.selectorLibrary.setExclude(configObject.exclude);
    }
}; // /includeConfig
