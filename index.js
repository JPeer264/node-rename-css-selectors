// process
const processSync = require('./lib/process/processSync');
const process = require('./lib/process/process');
const processCssSync = require('./lib/processCss/processCssSync');
const processCss = require('./lib/processCss/processCss');
const processJsSync = require('./lib/processJs/processJsSync');
const processJs = require('./lib/processJs/processJs');

// mapping
const generateMappingSync = require('./lib/mapping/generateMappingSync');
const generateMapping = require('./lib/mapping/generateMapping');
const loadMapping = require('./lib/mapping/loadMapping');

// config
const includeConfig = require('./lib/config/includeConfig');

module.exports = {
  processSync,
  process,
  processCssSync,
  processCss,
  processJsSync,
  processJs,
  generateMappingSync,
  generateMapping,
  loadMapping,
  includeConfig,
};
