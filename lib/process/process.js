const { fromCallback } = require('universalify');
const merge = require('lodash.merge');
const fs = require('fs');
const rcs = require('rcs-core');
const path = require('path');
const glob = require('glob');
const async = require('async');
const assert = require('assert');

const save = require('../helper/save');

const rcsProcess = (pathString, opts, cb) => {
  const fileExt = {
    js: ['.js', '.jsx'],
    css: ['.css', '.scss', '.sass', '.less'],
    html: ['.html', '.htm'],
  };
  const availableTypes = ['auto', 'js', 'html', 'css', 'any'];
  const optionsDefault = {
    type: 'auto',
    overwrite: false,
    cwd: process.cwd(),
    newPath: 'rcs',
  };

  let globString = pathString;
  let options = opts;
  let callback = cb;

  // set callback if options are not set
  if (typeof callback !== 'function') {
    callback = options;
    options = {};
  }

  options = merge(optionsDefault, options);

  assert(
    availableTypes.includes(options.type),
    `options.type must be one of the following: ${availableTypes}`,
  );

  if (Object.prototype.toString.call(pathString) === '[object Array]') {
    globString = `{${pathString.join(',')}}`;
  }

  glob(globString, {
    cwd: options.cwd,
  }, (errGlob, filesArray) => {
    if (errGlob) {
      return callback(errGlob);
    }

    // fail if nothing is found
    if (filesArray.length <= 0) {
      return callback({
        message: 'No files found',
        error: 'ENOENT',
      });
    }

    // sort in case of 'auto'
    const cssFiles = filesArray.filter(file => fileExt.css.includes(path.extname(file)));
    const replaceCssFiles = options.type === 'auto'
      ? cssFiles
      : filesArray;

    // call in series
    // not all selectors are stored, maybe some selectors are duplicated in different files
    return async.eachSeries(replaceCssFiles, (filePath, asyncCb) => {
      // skip if it is not meant to fill the library
      if (options.type !== 'auto' && options.type !== 'css') {
        return asyncCb();
      }

      return fs.readFile(path.join(options.cwd, filePath), (errReadFile, bufferData) => {
        if (errReadFile) {
          return asyncCb(errReadFile);
        }

        const availableOptions = {
          prefix: options.prefix,
          suffix: options.suffix,
          replaceKeyframes: options.replaceKeyframes,
          preventRandomName: options.preventRandomName,
          ignoreAttributeSelectors: options.ignoreAttributeSelectors,
        };

        rcs.fillLibraries(bufferData.toString(), availableOptions);

        return asyncCb();
      });
    }, (errEachSeries) => {
      if (errEachSeries) {
        return callback(errEachSeries);
      }

      // now all files can be renamed and saved
      // can be fired parallel
      // all selectors are collected
      // ⚡️ speed it up with async.each ⚡️
      return async.each(filesArray, (filePath, asyncEachCb) => {
        fs.readFile(path.join(options.cwd, filePath), 'utf8', (err, bufferData) => {
          let data;
          let shouldOverwrite = options.overwrite;

          if (err) {
            return asyncEachCb(err);
          }

          // check which process function needs to get triggered
          try {
            if (
              options.type === 'js' ||
              (
                options.type === 'auto' &&
                fileExt.js.includes(path.extname(filePath))
              )
            ) {
              data = rcs.replace.js(bufferData, options.parserOptions);
            } else if (
              options.type === 'css' ||
              (
                options.type === 'auto' &&
                fileExt.css.includes(path.extname(filePath))
              )
            ) {
              data = rcs.replace.css(bufferData);
            } else if (
              options.type === 'html' ||
              (
                options.type === 'auto' &&
                fileExt.html.includes(path.extname(filePath))
              )
            ) {
              data = rcs.replace.html(bufferData);
            } else {
              data = rcs.replace.any(bufferData);
            }
          } catch (e) {
            return asyncEachCb(e);
          }

          const joinedPath = path.join(options.newPath, filePath);

          if (!options.overwrite) {
            shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
          }

          return save(joinedPath, data, { overwrite: shouldOverwrite }, (errSave) => {
            if (errSave) {
              return asyncEachCb(errSave);
            }

            return asyncEachCb(null);
          });
        });
      }, (errProcess) => {
        if (errProcess) {
          return callback(errProcess);
        }

        return callback(null);
      });
    });
  });
}; // /process

module.exports = fromCallback(rcsProcess);
