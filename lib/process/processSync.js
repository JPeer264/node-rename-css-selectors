'use strict';

const _ = require('lodash');
const fs = require('fs');
const rcs = require('rcs-core');
const path = require('path');
const glob = require('glob');

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

    if (newOptions.collectSelectors) {
      data = rcs.replace.bufferCss(fs.readFileSync(path.join(newOptions.cwd, filePath)), newOptions);
    } else if (newOptions.replaceJs) {
      data = rcs.replace.bufferJs(fs.readFileSync(path.join(newOptions.cwd, filePath)), newOptions);
    } else {
      data = rcs.replace.buffer(fs.readFileSync(path.join(newOptions.cwd, filePath)), newOptions);
    }

    rcs.helper.saveSync(joinedPath, data, { overwrite: shouldOverwrite });
  });
}; // /processSync

module.exports = processSync;
