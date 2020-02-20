import { fromPromise } from 'universalify';
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

const generateMapping = async (
  pathString: string,
  opts: GenerateMappingOptions,
): Promise<void> => {
  let fileName = 'renaming_map';
  let fileNameExt = '.json';
  let mappingName = 'CSS_NAME_MAPPING';

  const options: GenerateMappingOptions = {
    cssMapping: true,
    cssMappingMin: false,
    json: true,
    origValues: true,
    isSelectors: true,
    overwrite: false,
    ...opts,
  };

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

  await save(`${newPath}${fileNameExt}`, writeData, { overwrite: options.overwrite });
}; // /generateMapping

export default fromPromise(generateMapping);
