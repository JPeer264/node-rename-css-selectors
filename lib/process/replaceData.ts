import rcs from 'rcs-core';
import path from 'path';

import { AllOptions } from './process';
import defaults from './defaults';

function replaceData(type: 'auto', filePath: string, fileData: string, options: AllOptions['auto']): string;
function replaceData(type: 'css', filePath: string, fileData: string, options: AllOptions['css']): string;
function replaceData(type: 'js', filePath: string, fileData: string, options: AllOptions['js']): string;
function replaceData(type: 'html', filePath: string, fileData: string, options: AllOptions['html']): string;
function replaceData(type: 'pug', filePath: string, fileData: string, options: AllOptions['pug']): string;
function replaceData(type: 'any', filePath: string, fileData: string, options: AllOptions['any']): string;
function replaceData(type: any, filePath: string, fileData: string, options: any): string {
  let data;

  if (
    type === 'js'
    || (
      type === 'auto'
      && defaults.fileExt.js.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.js(fileData, { ...options.espreeOptions, sourceFile: filePath });
  } else if (
    type === 'css'
    || (
      type === 'auto'
      && defaults.fileExt.css.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.css(fileData, { ...options, sourceFile: filePath });
  } else if (
    type === 'html'
    || (
      type === 'auto'
      && defaults.fileExt.html.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.html(fileData, { ...options, sourceFile: filePath });
  } else if (
    type === 'pug'
    || (
      type === 'auto'
      && defaults.fileExt.pug.includes(path.extname(filePath))
    )
  ) {
    data = rcs.replace.pug(fileData, { ...options, sourceFile: filePath });
  } else {
    data = rcs.replace.any(fileData, { ...options, sourceFile: filePath });
  }

  return data;
}

export default replaceData;
