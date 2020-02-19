import { fromCallback } from 'universalify';
import merge from 'lodash.merge';
import rcs from 'rcs-core';
import path from 'path';
import json from 'json-extra';

import save from '../helper/save';

export interface GenerateMappingOptions {
  cssMappingMin?: string | boolean;
  cssMapping?: string | boolean;
  origValues?: boolean;
  isSelectors?: boolean;
  json?: boolean;
  overwrite?: boolean;
}

const generateMapping = (
  pathString: string,
  opts: GenerateMappingOptions,
  cb: Callback,
): void => {
  let fileName = 'renaming_map';
  let fileNameExt = '.json';
  let mappingName = 'CSS_NAME_MAPPING';

  const optionsDefault: GenerateMappingOptions = {
    cssMapping: true,
    cssMappingMin: false,
    json: true,
    origValues: true,
    isSelectors: true,
    overwrite: false,
  };

  let options = opts;
  let callback = cb;

  // set cb if options are not set
  if (typeof callback !== 'function') {
    callback = options as () => void;
    options = {};
  }

  options = merge({}, optionsDefault, options);

  if (options.cssMappingMin) {
    options.origValues = false;
    mappingName = 'CSS_NAME_MAPPING_MIN';
    fileName = `${fileName}_min`;
  }

  if (typeof options.cssMappingMin === 'string') {
    mappingName = options.cssMappingMin;
    fileName = options.cssMappingMin;
  }

  if (typeof options.cssMapping === 'string') {
    fileName = options.cssMapping;
  }

  const cssMappingArray = rcs.selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: !options.origValues,
    addSelectorType: options.isSelectors,
  } as any); // todo jpeer: remove any as soon as types are fixed in rcs-core

  const cssMappingJsonString = json.check(cssMappingArray) ? cssMappingArray : json.stringify(cssMappingArray, null, '\t');
  let writeData = cssMappingJsonString;
  const newPath = path.join(pathString, fileName);

  // no json
  if (!options.json) {
    writeData = `var ${mappingName} = ${cssMappingJsonString};`;
    fileNameExt = '.js';
  }

  save(`${newPath}${fileNameExt}`, writeData, { overwrite: options.overwrite }, (err: any, data: string) => {
    if (err) {
      callback(err);
    }

    callback(null, data);
  });
}; // /generateMapping

export default fromCallback(generateMapping);
