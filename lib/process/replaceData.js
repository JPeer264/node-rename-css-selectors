import rcs from 'rcs-core';
import path from 'path';

import defaults from './defaults';

const replaceData = (filePath, fileData, options) => {
  let data;

  if (
    options.type === 'js' ||
    (
      options.type === 'auto' &&
      defaults.fileExt.js.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.js(fileData, options.parserOptions);
  } else if (
    options.type === 'css' ||
    (
      options.type === 'auto' &&
      defaults.fileExt.css.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.css(fileData);
  } else if (
    options.type === 'html' ||
    (
      options.type === 'auto' &&
      defaults.fileExt.html.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.html(fileData);
  } else if (
    options.type === 'pug' ||
    (
      options.type === 'auto' &&
      defaults.fileExt.pug.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.pug(fileData);
  } else {
    data = rcs.replace.any(fileData);
  }

  return data;
};

module.exports = replaceData;
