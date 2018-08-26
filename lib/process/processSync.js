const merge = require('lodash.merge');
const fs = require('fs');
const rcs = require('rcs-core');
const path = require('path');
const glob = require('glob');
const assert = require('assert');

const saveSync = require('../helper/saveSync');
const replaceData = require('./replaceData');
const { fileExt, availableTypes, optionsDefault } = require('./defaults');

/**
 * The synchronous method for process
 */
const processSync = (pathString, opts) => {
  let globString = pathString;
  const options = merge({}, optionsDefault, opts);

  assert(
    availableTypes.includes(options.type),
    `options.type must be one of the following: ${availableTypes}`,
  );

  if (Object.prototype.toString.call(pathString) === '[object Array]') {
    globString = `{${pathString.join(',')}}`;
  }

  const globArray = glob.sync(globString, { cwd: options.cwd });
  const cssFiles = globArray.filter(file => fileExt.css.includes(path.extname(file)));
  const fillLibraryFiles = options.type === 'auto'
    ? cssFiles
    : globArray;

  if (options.type === 'auto' || options.type === 'css') {
    fillLibraryFiles.forEach((filePath) => {
      const fileData = fs.readFileSync(path.join(options.cwd, filePath), 'utf8');
      const availableOptions = {
        prefix: options.prefix,
        suffix: options.suffix,
        replaceKeyframes: options.replaceKeyframes,
        preventRandomName: options.preventRandomName,
        ignoreAttributeSelectors: options.ignoreAttributeSelectors,
      };

      rcs.fillLibraries(fileData.toString(), availableOptions);
    });
  }

  globArray.forEach((filePath) => {
    let shouldOverwrite = options.overwrite;
    const joinedPath = path.join(options.newPath, filePath);

    if (!options.overwrite) {
      shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
    }

    const fileData = fs.readFileSync(path.join(options.cwd, filePath), 'utf8');
    const data = replaceData(filePath, fileData, options);

    saveSync(joinedPath, data, { overwrite: shouldOverwrite });
  });
}; // /processSync

module.exports = processSync;
