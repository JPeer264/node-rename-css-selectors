const merge = require('lodash.merge');
const rcs = require('rcs-core');
const path = require('path');
const json = require('json-extra');

const saveSync = require('../helper/saveSync');

const generateMappingSync = (pathString, options) => {
  let fileName = 'renaming_map';
  let fileNameExt = '.json';
  let mappingName = 'CSS_NAME_MAPPING';

  const optionsDefault = {
    cssMapping: true,
    cssMappingMin: false,
    extended: false,
    json: true,
    origValues: true,
    isSelectors: true,
    overwrite: false,
  };

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

  const cssClassMappingArray = rcs.selectorsLibrary.getClassSelector().getAll({
    extend: options.extended,
    getRenamedValues: !options.origValues,
    addSelectorType: options.isSelectors,
  });
  const cssIdMappingArray = rcs.selectorsLibrary.getIdSelector().getAll({
    extend: options.extended,
    getRenamedValues: !options.origValues,
    addSelectorType: options.isSelectors,
  });
  const cssMappingArray = { 'class': cssClassMappingArray, 'id' : cssIdMappingArray };

  const cssMappingJsonString = json.check(cssMappingArray) ? cssMappingArray : json.stringify(cssMappingArray, null, '\t');
  let writeData = cssMappingJsonString;
  const newPath = path.join(pathString, fileName);

  // no json
  if (!options.json) {
    writeData = `var ${mappingName} = ${cssMappingJsonString};`;
    fileNameExt = '.js';
  }

  saveSync(`${newPath}${fileNameExt}`, writeData, { overwrite: options.overwrite });
}; // /generateMappingSync

module.exports = generateMappingSync;
