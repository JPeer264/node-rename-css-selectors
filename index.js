'use strict';

const rcs   = require('rcs-core');
const fs    = require('fs-extra');
const path  = require('path');
const glob  = require('glob');
const json  = require('json-extra');
const async = require('async');
const _     = require('lodash');

/**
 * parses through every single document and renames the names
 *
 * @module renameCssSelectors
 */
const renameCssSelectors = module.exports = {};

// PROCESS
renameCssSelectors.processSync    = require('./lib/process/processSync');
renameCssSelectors.process        = require('./lib/process/process');
renameCssSelectors.processCssSync = require('./lib/processCss/processCssSync');
renameCssSelectors.processCss     = require('./lib/processCss/processCss');
renameCssSelectors.processJsSync  = require('./lib/processJs/processJsSync');
renameCssSelectors.processJs      = require('./lib/processJs/processJs');

// MAPPING
renameCssSelectors.generateMappingSync = require('./lib/mapping/generateMappingSync');
renameCssSelectors.generateMapping = require('./lib/mapping/generateMapping');
renameCssSelectors.loadMapping = require('./lib/mapping/loadMapping');

// CONFIG
renameCssSelectors.includeConfig = require('./lib/config/includeConfig');
