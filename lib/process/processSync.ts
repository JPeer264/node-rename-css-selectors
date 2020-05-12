import fs from 'fs';
import rcs from 'rcs-core';
import path from 'path';
import glob from 'glob';
import assert from 'assert';

import saveSync from '../helper/saveSync';
import replaceData from './replaceData';
import defaults from './defaults';
import { AllOptions } from './process';
import Config from '../Config';

const { fileExt, availableTypes, optionsDefault } = defaults;

/**
 * The synchronous method for process
 */
function processSync(type: 'auto', pathString: string | string[], opts?: AllOptions['auto']): void;
function processSync(type: 'css', pathString: string | string[], opts?: AllOptions['css']): void;
function processSync(type: 'js', pathString: string | string[], opts?: AllOptions['js']): void;
function processSync(type: 'html', pathString: string | string[], opts?: AllOptions['html']): void;
function processSync(type: 'pug', pathString: string | string[], opts?: AllOptions['pug']): void;
function processSync(type: 'any', pathString: string | string[], opts?: AllOptions['any']): void;
function processSync(type: any, pathString: string | string[], opts: any = {}): void {
  let globString: string;
  const options = { ...optionsDefault, ...opts };

  assert(
    availableTypes.includes(type),
    `type must be one of the following: ${availableTypes}`,
  );

  if (Array.isArray(pathString)) {
    globString = `{${pathString.join(',')}}`;
  } else {
    globString = pathString;
  }

  const globArray = glob.sync(globString, {
    cwd: options.cwd,
    ignore: Config.getInstance().ignorePatterns,
  });
  const cssHtmlFiles = globArray.filter((file) => (
    fileExt.css.includes(path.extname(file))
    || fileExt.html.includes(path.extname(file))
  ));
  const fillLibraryFiles = type === 'auto'
    ? cssHtmlFiles
    : globArray;

  if (type === 'auto' || type === 'css' || type === 'html') {
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
    const data = replaceData(type, filePath, fileData, options);

    saveSync(joinedPath, data, { overwrite: shouldOverwrite });
  });

  rcs.warnings.warn();
} // /processSync

export default processSync;
