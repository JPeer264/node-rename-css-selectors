const merge = require('lodash.merge');
const fs = require('fs');
const rcs = require('rcs-core');
const path = require('path');
const glob = require('glob');
const assert = require('assert');

const saveSync = require('../helper/saveSync');
const replaceData = require('./replaceData');
const { fileExt, availableTypes, optionsDefault } = require('./defaults');
const config = require('../config/config');

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

  const globArray = glob.sync(globString, { cwd: options.cwd, ignore: config.ignorePatterns });
  const cssHtmlFiles = globArray.filter(file => (
    fileExt.css.includes(path.extname(file))
    || fileExt.html.includes(path.extname(file))
  ));
  const fillLibraryFiles = options.type === 'auto'
    ? cssHtmlFiles
    : globArray;

  if (options.type === 'auto' || options.type === 'css' || options.type === 'html') {
    fillLibraryFiles.forEach((filePath) => {
      const fileData = fs.readFileSync(path.join(options.cwd, filePath), 'utf8');
      const isHtml = fileExt.html.includes(path.extname(filePath));

      rcs.fillLibraries(
        fileData.toString(),
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

  rcs.warnings.warn();
}; // /processSync

module.exports = processSync;
