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
    // eslint-disable-next-line no-param-reassign
    options.sourceFile = filePath;
    data = rcs.replace.js(fileData, options.parserOptions);
  } else if (
    options.type === 'css' ||
    (
      options.type === 'auto' &&
      fileExt.css.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.css(fileData, { sourceFile: filePath });
  } else if (
    options.type === 'html' ||
    (
      options.type === 'auto' &&
      fileExt.html.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.html(fileData, { sourceFile: filePath });
  } else if (
    options.type === 'pug' ||
    (
      options.type === 'auto' &&
      fileExt.pug.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.pug(fileData, { sourceFile: filePath });
  } else {
    data = rcs.replace.any(fileData, { sourceFile: filePath });
  }

  return data;
};

module.exports = replaceData;
