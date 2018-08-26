const rcs = require('rcs-core');
const path = require('path');
const { fileExt } = require('./defaults');

const replaceData = (filePath, fileData, options) => {
  let data;

  if (
    options.type === 'js' ||
    (
      options.type === 'auto' &&
      fileExt.js.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.js(fileData, options.parserOptions);
  } else if (
    options.type === 'css' ||
    (
      options.type === 'auto' &&
      fileExt.css.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.css(fileData);
  } else if (
    options.type === 'html' ||
    (
      options.type === 'auto' &&
      fileExt.html.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.html(fileData);
  } else {
    data = rcs.replace.any(fileData);
  }

  return data;
};

module.exports = replaceData;
