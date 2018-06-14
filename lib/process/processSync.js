

const _ = require('lodash');
const fs = require('fs');
const rcs = require('rcs-core');
const path = require('path');
const glob = require('glob');

const saveSync = require('../helper/saveSync');

/**
 * The synchronous method for process
 */
const processSync = (pathString, options) => {
  const optionsDefault = {
    collectSelectors: false,
    overwrite: false,
    cwd: process.cwd(),
    newPath: 'rcs',
    flatten: false,
  };

  const newOptions = _.merge({}, optionsDefault, options);

  let globString = pathString;

  if (Object.prototype.toString.call(pathString) === '[object Array]') {
    globString = `{${pathString.join(',')}}`;
  }

  const globArray = glob.sync(globString, {
    cwd: newOptions.cwd,
  });

  // call replaceCss if newOptions.collectSelectors is set to true
  globArray.forEach((filePath) => {
    let data;
    const joinedPath = path.join(newOptions.newPath, filePath);
    let shouldOverwrite = newOptions.overwrite;

    if (!newOptions.overwrite) {
      shouldOverwrite = joinedPath !== path.join(newOptions.cwd, filePath);
    }

    const fileData = fs.readFileSync(path.join(newOptions.cwd, filePath));

    if (newOptions.collectSelectors) {
      const normalizedOptions = {
        ignoreAttributeSelectors: options.ignoreAttributeSelector,
        prefix: options.prefix || '',
        suffix: options.suffix || '',
        preventRandomName: options.preventRandomName,
        replaceKeyframes: options.replaceKeyframes,
      };

      rcs.fillLibraries(fileData, normalizedOptions);

      data = rcs.replace.css(fileData);
    } else if (newOptions.replaceJs) {
      data = rcs.replace.js(fileData);
    } else {
      data = rcs.replace.any(fileData);
    }

    saveSync(joinedPath, data, { overwrite: shouldOverwrite });
  });
}; // /processSync

module.exports = processSync;
