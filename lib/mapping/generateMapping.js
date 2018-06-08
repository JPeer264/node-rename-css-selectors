'use strict';

const _ = require('lodash');
const rcs = require('rcs-core');
const path = require('path');
const json = require('json-extra');

const save = require('../helper/save');

/**
 * @typedef {Object} generateMappingOptions
 * @property {Boolean | String} [cssMapping=true]       true will generate the css mapping. A string will generate the css mapping file and the object is called like the string
 * @property {Boolean | String} [cssMappingMin=false]   like the property cssMapping
 * @property {Boolean} [extended=false]                 defines if metadata should be added to the selector
 * @property {Boolean} [json=true]                      defines if metadata should be added to the selector
 * @property {Boolean} [isSelectors=true]               if it should write the selector type into the key (# | .)
 */
/**
 * generates a file including all old and new selectors/names
 * includes also unused class selectors
 *
 * @param {String} pathString where it should get saved
 * @param {generateMappingOptions} [options]
 */
const generateMapping = (pathString, options, cb) => {
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

  // set cb if options are not set
  if (typeof cb !== 'function') {
    cb = options;
    options = {};
  }

  options = _.merge(optionsDefault, options);

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

  const cssMappingArray = rcs.selectorLibrary.getAll({
    extend: options.extended,
    getRenamedValues: !options.origValues,
    addSelectorType: options.isSelectors,
  });

  const cssMappingJsonString = json.check(cssMappingArray) ? cssMappingArray : json.stringify(cssMappingArray, null, '\t');
  let writeData = cssMappingJsonString;
  const newPath = path.join(pathString, fileName);

  // no json
  if (!options.json) {
    writeData = `var ${mappingName} = ${cssMappingJsonString};`;
    fileNameExt = '.js';
  }

  save(`${newPath}${fileNameExt}`, writeData, { overwrite: options.overwrite }, (err, data) => {
    if (err) cb(err);

    cb(null, data);
  });
}; // /generateMapping

module.exports = generateMapping;
