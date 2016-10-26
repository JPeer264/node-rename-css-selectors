'use strict';

const rcs   = require('./utils/rcs');
const fs    = require('fs-extra');
const path  = require('path');
const glob  = require('glob');
const async = require('async');
const _     = require('lodash');

/**
 * parses through every single document and renames the names
 *
 * @module cli
 */
const cli = module.exports = {};

/**
 * @typedef {Object} processOptions
 * @property {Boolean}  [collectSelectors=false]    git dif the triggered files are css files
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
cli.process = (pathString, options, cb) => {
    const optionsDefault = {
        collectSelectors: false,
        overwrite: false,
        cwd: process.cwd(),
        newPath: 'rcs',
        flatten: false
    };

    // @todo add flatten files

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    options = _.merge(optionsDefault, options);

    glob(pathString, {
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
                rcs.fileReplace.replaceCss(path.join(options.cwd, filePath), (err, data) => {
                    let joinedPath;

                    if (err) callback(err);

                    joinedPath = path.join(options.newPath, filePath);

                    rcs.helper.save(joinedPath, data.data, (err) => {
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
                rcs.fileReplace.replace(path.join(options.cwd, filePath), (err, data) => {
                    let joinedPath;

                    if (err) callback(err);

                    joinedPath = path.join(options.newPath, filePath);

                    rcs.helper.save(joinedPath, data.data, (err) => {
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
};

/**
 * process over all css files - set and replace
 * does exactly the same as cli.process, but set the collectSelectors option to true
 *
 * @param  {pathString}         pathString this pathString can be either an expression for `glob` or a filepath
 * @param  {processOptions}     options
 * @param  {Function} cb        the callback
 * @return {Function} cb
 */
cli.processCss = (pathString, options, cb) => {
    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    // set the css power for cli.process
    options.collectSelectors = true;

    cli.process(pathString, options, cb);
} // /processCss

/**
 * @typedef {Object} generateLFOptions
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
 * @param {generateLFOptions} [options]
 */
cli.generateLibraryFile = (pathString, options, cb) => {
    let mappingName = 'CSS_NAME_MAPPING';
    let mappingNameMin = 'CSS_NAME_MAPPING_MIN';
    const optionsDefault = {
        cssMapping: true,
        cssMappingMin: false,
        extended: false,
        json: false
    }

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    options = _.merge(optionsDefault, options);

    async.parallel([
        callback => {
            // normal classes
            if (options.cssMapping) {
                const newPath         = path.join(pathString, 'renaming_map.js');
                const cssMappingArray = rcs.selectorLibrary.getAll({
                    origValues: true,
                    isSelectors: true,
                    extended: options.extended,
                });

                if (typeof options.cssMapping === 'string') {
                    mappingName = options.cssMapping;
                }

                rcs.helper.save(newPath, 'var ' + mappingName + ' = ' + rcs.helper.objectToJson(cssMappingArray) + ';', (err, data) => {
                    if (err) callback(err);

                    callback(null, data);
                });
            } else {
                callback(null);
            }
        },
        callback => {
            // compressed classes
            if (options.cssMappingMin) {
                const newPathMin      = path.join(pathString, 'renaming_map_min.js');
                const cssMappingMinArray = rcs.selectorLibrary.getAll({
                    origValues: false,
                    isSelectors: true,
                    extended: options.extended,
                });

                if (typeof options.cssMapping === 'string') {
                    mappingName = options.cssMapping;
                }

                rcs.helper.save(newPathMin, 'var ' + mappingNameMin + ' = ' + rcs.helper.objectToJson(cssMappingMinArray) + ';', (err, data) => {
                    if (err) callback(err);

                    callback(null, data);
                });
            } else {
                callback(null);
            }
        }
    ], (err, results) => {
        if (err) return cb(err);

        return cb(null);
    });
}; // /generateLibraryFile
