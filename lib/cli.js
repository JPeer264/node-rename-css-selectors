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

cli.save = (newFilePath, data, cb) => {
    // @todo check if the filepath has an .ext
    // @todo check if the new filename is the same .ext
    // @todo do not overwrite file! use for that an flag
    fs.mkdirs(path.dirname(newFilePath), (err) => {
        fs.writeFile(newFilePath, data, (err, data) => {
            if (err) return cb(err);

            cb(null, "Successfully wrote " + newFilePath);
        });
    });
};

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

                    cli.save(joinedPath, data.data, (err) => {
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

                    cli.save(joinedPath, data.data, (err) => {
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
}
