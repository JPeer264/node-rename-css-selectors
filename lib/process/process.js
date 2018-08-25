const { fromCallback } = require('universalify');
const merge = require('lodash.merge');
const fs = require('fs');
const rcs = require('rcs-core');
const path = require('path');
const glob = require('glob');
const async = require('async');

const save = require('../helper/save');

const rcsProcess = (pathString, options, cb) => {
  const optionsDefault = {
    collectSelectors: false,
    overwrite: false,
    cwd: process.cwd(),
    newPath: 'rcs',
  };

  let globString = pathString;

  // set cb if options are not set
  if (typeof cb !== 'function') {
    cb = options;
    options = {};
  }

  options = merge(optionsDefault, options);

  if (Object.prototype.toString.call(pathString) === '[object Array]') {
    globString = `{${pathString.join(',')}}`;
  }

  glob(globString, {
    cwd: options.cwd,
  }, (errGlob, filesArray) => {
    if (errGlob) {
      return cb(errGlob);
    }

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
      return async.eachSeries(filesArray, (filePath, callback) => {
        fs.readFile(path.join(options.cwd, filePath), (errEachSeries, bufferData) => {
          let shouldOverwrite = options.overwrite;

          if (errEachSeries) return callback(errEachSeries);

          const availableOptions = {
            prefix: options.prefix,
            suffix: options.suffix,
            replaceKeyframes: options.replaceKeyframes,
            preventRandomName: options.preventRandomName,
            ignoreAttributeSelectors: options.ignoreAttributeSelectors,
          };

          rcs.fillLibraries(bufferData.toString(), availableOptions);

          const data = rcs.replace.css(bufferData);
          const joinedPath = path.join(options.newPath, filePath);

          if (!options.overwrite) {
            shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
          }

          return save(joinedPath, data, { overwrite: shouldOverwrite }, (errSave) => {
            if (errSave) return callback(errSave);

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

    // can be fired asynchronous
    // all selectors are collected
    // ⚡️ speed it up with async ⚡️
    return async.each(filesArray, (filePath, callback) => {
      fs.readFile(path.join(options.cwd, filePath), 'utf8', (err, bufferData) => {
        let data;
        let shouldOverwrite = options.overwrite;

        if (err) {
          return callback(err);
        }

        // check wether to replace javascript files or not
        try {
          if (options.replaceJs) {
            data = rcs.replace.js(bufferData, options.parserOptions);
          } else {
            data = rcs.replace.any(bufferData);
          }
        } catch (e) {
          return callback(e);
        }

        const joinedPath = path.join(options.newPath, filePath);

        if (!options.overwrite) {
          shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
        }

        return save(joinedPath, data, { overwrite: shouldOverwrite }, (errSave) => {
          if (errSave) {
            return callback(errSave);
          }

          return callback();
        });
      });
    }, (err) => {
      if (err) {
        return cb(err);
      }

      return cb(null, true);
    });
  });
}; // /process

module.exports = fromCallback(rcsProcess);
