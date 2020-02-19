import rcs from 'rcs-core';
import path from 'path';

import defaults from './defaults';
import { Options } from './process';

const replaceData = (filePath: string, fileData: string, options: Options): string => {
  let data;

  if (
    options.type === 'js'
    || (
      options.type === 'auto'
      && defaults.fileExt.js.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.js(fileData, options.espreeOptions);
  } else if (
    options.type === 'css'
    || (
      options.type === 'auto'
      && defaults.fileExt.css.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.css(fileData, options);
  } else if (
    options.type === 'html'
    || (
      options.type === 'auto'
      && defaults.fileExt.html.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.html(fileData, options);
  } else if (
    options.type === 'pug'
    || (
      options.type === 'auto'
      && defaults.fileExt.pug.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.pug(fileData, options);
  } else {
    data = rcs.replace.any(fileData, options);
  }

  return data;
};

export default replaceData;
