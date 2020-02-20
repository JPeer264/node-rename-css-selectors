import { fromPromise } from 'universalify';
import fs from 'fs';
import rcs from 'rcs-core';
import path from 'path';
import glob from 'glob';
import { eachSeries, each } from 'async';
import assert from 'assert';

import { ReplaceStringOptions } from 'rcs-core/dest/replace/string';
import { ReplaceHtmlOptions } from 'rcs-core/dest/replace/html';
import { ReplacePugOptions } from 'rcs-core/dest/replace/pug';
import { ReplaceCssOptions } from 'rcs-core/dest/replace/css';
import { ReplaceJsOptions } from 'rcs-core/dest/replace/js';
import { FillLibrariesOptions } from 'rcs-core/dest/fillLibraries';

import save from '../helper/save';
import replaceData from './replaceData';
import defaults from './defaults';


const { fileExt, availableTypes, optionsDefault } = defaults;

export interface BaseOptions {
  cwd?: string;
  newPath?: string;
  overwrite?: boolean;
}

export interface AllOptions {
  pug: BaseOptions & ReplacePugOptions;
  any: BaseOptions & ReplaceStringOptions;
  js: BaseOptions & ReplaceJsOptions;
  html: BaseOptions & FillLibrariesOptions & ReplaceHtmlOptions;
  css: BaseOptions & FillLibrariesOptions & ReplaceCssOptions;
  auto: (
    & BaseOptions
    & FillLibrariesOptions
    & ReplaceCssOptions
    & ReplacePugOptions
    & ReplaceHtmlOptions
    & ReplaceStringOptions
    & ReplaceJsOptions
  );
}

export type Options =
  | AllOptions['pug'] & { type: 'pug' }
  | AllOptions['any'] & { type: 'any' }
  | AllOptions['js'] & { type: 'js' }
  | AllOptions['html'] & { type: 'html' }
  | AllOptions['css'] & { type: 'css' }
  | AllOptions['auto'] & { type: 'auto' }

const rcsProcess = async (pathString: string, opts: Options): Promise<RCSError | void> => {
  const options = { ...optionsDefault, ...opts };

  let globString = pathString;

  assert(
    availableTypes.includes(options.type),
    `options.type must be one of the following: ${availableTypes}`,
  );

  if (Array.isArray(pathString)) {
    globString = pathString.length > 1
      ? `{${pathString.join(',')}}`
      : pathString[0];
  }

  const cwd = options.cwd || process.cwd();
  const filesArray: string[] = await new Promise((res, rej) => (
    glob(globString, { cwd }, (error, allFiles) => (
      error
        ? rej(error)
        : res(allFiles)
    ))
  ));

  // fail if nothing is found
  if (filesArray.length <= 0) {
    throw new Error('No files found');
  }

  // sort in case of 'auto'
  const cssHtmlFiles = filesArray.filter((file) => (
    fileExt.css.includes(path.extname(file))
    || fileExt.html.includes(path.extname(file))
  ));

  const fillLibraryFiles = options.type === 'auto'
    ? cssHtmlFiles
    : filesArray;

  // call in series
  // not all selectors are stored, maybe some selectors are duplicated in different files
  await new Promise((res, rej) => (
    eachSeries(fillLibraryFiles, (filePath, asyncCb) => {
      // skip if it is not meant to fill the library
      if (options.type !== 'auto' && options.type !== 'css' && options.type !== 'html') {
        return asyncCb();
      }

      return fs.readFile(path.join(cwd, filePath), (errReadFile, bufferData) => {
        if (errReadFile) {
          return asyncCb(errReadFile);
        }

        // add here again so typescript gets the correct option types
        if (options.type !== 'auto' && options.type !== 'css' && options.type !== 'html') {
          return undefined;
        }

        const isHtml = fileExt.html.includes(path.extname(filePath));

        rcs.fillLibraries(
          bufferData.toString(),
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

        return asyncCb();
      });
    }, (err) => (
      err ? rej(err) : res()
    ))
  ));

  await new Promise((res, rej) => (
    // now all files can be renamed and saved
    // can be fired parallel
    // all selectors are collected
    // ⚡️ speed it up with async/each ⚡️
    each(filesArray, (filePath, asyncEachCb) => {
      fs.readFile(path.join(cwd, filePath), 'utf8', (err, bufferData) => {
        let data;
        let shouldOverwrite = options.overwrite;

        if (err) {
          return asyncEachCb(err);
        }

        try {
          data = replaceData(filePath, bufferData, options);
        } catch (e) {
          return asyncEachCb(e);
        }

        const joinedPath = path.join(options.newPath || cwd, filePath);

        if (!options.overwrite) {
          shouldOverwrite = joinedPath !== path.join(cwd, filePath);
        }

        return save(joinedPath, data, { overwrite: shouldOverwrite }, (errSave: any) => {
          if (errSave) {
            return asyncEachCb(errSave);
          }

          return asyncEachCb(null);
        });
      });
    }, (errProcess) => (
      errProcess ? rej(errProcess) : res()
    ))
  ));
}; // /process

export default fromPromise(rcsProcess);
