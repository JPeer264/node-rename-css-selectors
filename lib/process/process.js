import { fromCallback } from 'universalify';
import merge from 'lodash.merge';
import fs from 'fs';
import rcs from 'rcs-core';
import path from 'path';
import glob from 'glob';
import async from 'async';
import assert from 'assert';

import save from '../helper/save';
import replaceData from './replaceData';
import defaults from './defaults';

const { fileExt, availableTypes, optionsDefault } = defaults;

const rcsProcess = (pathString, opts, cb) => {
  let globString = pathString;
  let options = opts;
  let callback = cb;

  // set callback if options are not set
  if (typeof callback !== 'function') {
    callback = options;
    options = {};
  }

  options = merge({}, optionsDefault, options);

  assert(
    availableTypes.includes(options.type),
    `options.type must be one of the following: ${availableTypes}`,
  );

  if (Array.isArray(pathString)) {
    globString = pathString.length > 1
      ? `{${pathString.join(',')}}`
      : pathString[0];
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
    const cssHtmlFiles = filesArray.filter((file) => (
      fileExt.css.includes(path.extname(file))
      || fileExt.html.includes(path.extname(file))
    ));

    const fillLibraryFiles = options.type === 'auto'
      ? cssHtmlFiles
      : filesArray;

    // call in series
    // not all selectors are stored, maybe some selectors are duplicated in different files
    return async.eachSeries(fillLibraryFiles, (filePath, asyncCb) => {
      // skip if it is not meant to fill the library
      if (options.type !== 'auto' && options.type !== 'css' && options.type !== 'html') {
        return asyncCb();
      }

      return fs.readFile(path.join(options.cwd, filePath), (errReadFile, bufferData) => {
        if (errReadFile) {
          return asyncCb(errReadFile);
        }

        const isHtml = fileExt.html.includes(path.extname(filePath));

        rcs.fillLibraries(
          bufferData.toString(),
          {
            prefix: options.prefix,
            suffix: options.suffix,
            replaceKeyframes: options.replaceKeyframes,
            preventRandomName: options.preventRandomName,
            ignoreAttributeSelectors: options.ignoreAttributeSelectors,
            ignoreCssVariables: options.ignoreCssVariables,
            codeType: isHtml ? 'html' : 'css',
          },
        );

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

          try {
            data = replaceData(filePath, bufferData, options);
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

export default fromCallback(rcsProcess);
