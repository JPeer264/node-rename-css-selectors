'use strict';

const _ = require('lodash');
const fs = require('fs');
const rcs = require('rcs-core');
const path = require('path');
const glob = require('glob');
const async = require('async');

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
const rcsProcess = (pathString, options, cb) => {
  const optionsDefault = {
    collectSelectors: false,
    overwrite: false,
    cwd: process.cwd(),
    newPath: 'rcs',
    flatten: false,
  };

  let globString = pathString;

  // @todo add flatten files

  // set cb if options are not set
  if (typeof cb !== 'function') {
    cb = options;
    options = {};
  }

  options = _.merge(optionsDefault, options);

  if (Object.prototype.toString.call(pathString) === '[object Array]') {
    globString = `{${pathString.join(',')}}`;
  }

  glob(globString, {
    cwd: options.cwd,
  // eslint-disable-next-line consistent-return
  }, (err, filesArray) => {
    if (err) return cb(err);

    // fail if nothing is found
    if (filesArray.length <= 0) {
      return cb({
        message: 'No files found',
        error: 'ENOENT',
      });
    }

    // call replaceCss if options.collectSelectors is set to true
    if (options.collectSelectors) {
      // call in series
      // not all selectors are stored, maybe some selectors are duplicated in different files
      async.eachSeries(filesArray, (filePath, callback) => {
        fs.readFile(path.join(options.cwd, filePath), (err, bufferData) => {
          let shouldOverwrite = options.overwrite;

          if (err) return callback(err);

          const normalizedOptions = {
            ignoreAttributeSelectors: options.ignoreAttributeSelector,
            prefix: options.prefix || '',
            suffix: options.suffix || '',
            preventRandomName: options.preventRandomName,
            replaceKeyframes: options.replaceKeyframes,
          };

          rcs.fillLibraries(bufferData.toString(), normalizedOptions);

          const data = rcs.replace.css(bufferData);

          const joinedPath = path.join(options.newPath, filePath);

          if (!options.overwrite) {
            shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
          }

          return rcs.helper.save(joinedPath, data, { overwrite: shouldOverwrite }, (err) => {
            if (err) return callback(err);

            return callback();
          });
        });
      }, (err) => {
        if (err) {
          return cb(err);
        }

        return cb(null, true);
      });
    } else {
      // can be fired asynchronous
      // all selectors are collected
      // ⚡️ speed it up with async ⚡️
      async.each(filesArray, (filePath, callback) => {
        fs.readFile(path.join(options.cwd, filePath), 'utf8', (err, bufferData) => {
          let data;
          let shouldOverwrite = options.overwrite;

          if (err) return callback(err);

          // check wether to replace javascript files or not
          if (options.replaceJs) {
            data = rcs.replace.js(bufferData);
          } else {
            data = rcs.replace.any(bufferData);
          }

          const joinedPath = path.join(options.newPath, filePath);

          if (!options.overwrite) {
            shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
          }

          return rcs.helper.save(joinedPath, data, { overwrite: shouldOverwrite }, (err) => {
            if (err) return callback(err);

            return callback();
          });
        });
      }, (err) => {
        if (err) {
          return cb(err);
        }

        return cb(null, true);
      });
    }
  });
}; // /process

module.exports = rcsProcess;
