const merge = require('lodash.merge');
const rcs = require('rcs-core');
const path = require('path');
const { fileExt } = require('./defaults');

const replaceData = (filePath, fileData, options) => {
  let data;

  const sourceFile = { sourceFile: filePath };
  if (
    options.type === 'js' ||
    (
      options.type === 'auto' &&
      fileExt.js.includes(path.extname(filePath))
    )
  ) {
    const jsxType = { ecmaFeatures: { jsx: path.extname(filePath).match(/jsx/i) !== null } };
    data = rcs.replace.js(fileData, merge(jsxType, options.parserOptions, sourceFile));
  } else if (
    options.type === 'css' ||
    (
      options.type === 'auto' &&
      fileExt.css.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.css(fileData, sourceFile);
  } else if (
    options.type === 'html' ||
    (
      options.type === 'auto' &&
      fileExt.html.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.html(fileData, sourceFile);
  } else if (
    options.type === 'pug' ||
    (
      options.type === 'auto' &&
      fileExt.pug.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.pug(fileData, sourceFile);
  } else {
    data = rcs.replace.any(fileData, sourceFile);
  }

  return data;
};

module.exports = replaceData;
