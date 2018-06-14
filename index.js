/**
 * parses through every single document and renames the names
 *
 * @module renameCssSelectors
 */
const renameCssSelectors = {};

// PROCESS
renameCssSelectors.processSync = require('./lib/process/processSync');
renameCssSelectors.process = require('./lib/process/process');
renameCssSelectors.processCssSync = require('./lib/processCss/processCssSync');
renameCssSelectors.processCss = require('./lib/processCss/processCss');
renameCssSelectors.processJsSync = require('./lib/processJs/processJsSync');
renameCssSelectors.processJs = require('./lib/processJs/processJs');

// MAPPING
renameCssSelectors.generateMappingSync = require('./lib/mapping/generateMappingSync');
renameCssSelectors.generateMapping = require('./lib/mapping/generateMapping');
renameCssSelectors.loadMapping = require('./lib/mapping/loadMapping');

// CONFIG
renameCssSelectors.includeConfig = require('./lib/config/includeConfig');

module.exports = renameCssSelectors;
