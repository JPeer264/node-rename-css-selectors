'use strict';

const _    = require('lodash');
const rcs  = require('rcs-core');
const path = require('path');

/**
 * The synchronous method of generateMapping
 */
const generateMappingSync = (pathString, options) => {
    let fileName    = 'renaming_map';
    let fileNameExt = '.json';
    let mappingName = 'CSS_NAME_MAPPING';

    const optionsDefault = {
        cssMapping: true,
        cssMappingMin: false,
        extended: false,
        json: true,
        origValues: true,
        isSelectors: true,
        overwrite: false
    }

    options = _.merge(optionsDefault, options);

    if (options.cssMappingMin) {
        options.origValues = false;
        mappingName = 'CSS_NAME_MAPPING_MIN';
        fileName = fileName + '_min';
    }

    if (typeof options.cssMappingMin === 'string') {
        mappingName = options.cssMappingMin;
        fileName = options.cssMappingMin;
    }

    if (typeof options.cssMapping === 'string') {
        fileName = options.cssMapping;
    }

    const cssMappingArray = rcs.selectorLibrary.getAll({
        extended: options.extended,
        origValues: options.origValues,
        isSelectors: options.isSelectors
    });

    let cssMappingJsonString = rcs.helper.objectToJson(cssMappingArray);
    let writeData = cssMappingJsonString;
    let newPath = path.join(pathString, fileName);

    // no json
    if (!options.json) {
        writeData   = `var ${ mappingName } = ${ cssMappingJsonString };`
        fileNameExt = '.js';
    }

    rcs.helper.saveSync(`${ newPath }${ fileNameExt }`, writeData, { overwrite: options.overwrite });
} // /generateMappingSync

module.exports = generateMappingSync;
