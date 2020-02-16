import merge from 'lodash.merge';
import fs from 'fs';
import rcs from 'rcs-core';
import path from 'path';
import glob from 'glob';
import assert from 'assert';

import saveSync from '../helper/saveSync';
import replaceData from './replaceData';
import defaults from './defaults';
import { Options } from './process';

const { fileExt, availableTypes, optionsDefault } = defaults;

/**
 * The synchronous method for process
 */
const processSync = (pathString: string | string[], opts: Options): void => {
  let globString: string;
  const options = merge({}, optionsDefault, opts);

  assert(
    availableTypes.includes(options.type),
    `options.type must be one of the following: ${availableTypes}`,
  );

  if (Array.isArray(pathString)) {
    globString = `{${pathString.join(',')}}`;
  } else {
    globString = pathString;
  }

  const globArray = glob.sync(globString, { cwd: options.cwd });
  const cssHtmlFiles = globArray.filter((file) => (
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
}; // /processSync

export default processSync;