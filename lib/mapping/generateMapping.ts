import { fromPromise } from 'universalify';
import rcs from 'rcs-core';
import path from 'path';
import json from 'json-extra';
import { GenerateMappingOptions } from 'rcs-core/dest/mapping/generate';

import save from '../helper/save';

export interface Options extends GenerateMappingOptions {
  json?: boolean;
  overwrite?: boolean;
  fileName?: string;
}

const generateMapping = async (
  pathString: string,
  opts: Options,
): Promise<void> => {
  let fileName = 'renaming_map';
  let fileNameExt = '.json';
  let mappingName = 'CSS_NAME_MAPPING';

  const options: Options = {
    json: true,
    origValues: true,
    overwrite: false,
    ...opts,
  };

  if (!options.origValues) {
    options.origValues = false;
    mappingName = 'CSS_NAME_MAPPING_MIN';
    fileName = `${fileName}_min`;
  }

  if (options.fileName) {
    fileName = options.fileName;
    mappingName = options.fileName;
  }

  const cssMappingArray = rcs.mapping.generate(opts);

  let mapping = json.stringify(cssMappingArray, null, '\t');
  const newPath = path.join(pathString, fileName);

  // no json
  if (!options.json) {
    mapping = `var ${mappingName} = ${mapping};`;
    fileNameExt = '.js';
  }

  await save(`${newPath}${fileNameExt}`, mapping, { overwrite: options.overwrite });
}; // /generateMapping

export default fromPromise(generateMapping);
