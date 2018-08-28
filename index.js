// process
const typeChooserSync = require('./lib/process/typeChooser/typeChooserSync');
const typeChooser = require('./lib/process/typeChooser/typeChooser');

// mapping
const generateMappingSync = require('./lib/mapping/generateMappingSync');
const generateMapping = require('./lib/mapping/generateMapping');
const loadMapping = require('./lib/mapping/loadMapping');

// config
const includeConfig = require('./lib/config/includeConfig');

module.exports = {
  process: {
    cssSync: typeChooserSync('css'),
    css: typeChooser('css'),
    jsSync: typeChooserSync('js'),
    js: typeChooser('js'),
    htmlSync: typeChooserSync('html'),
    html: typeChooser('html'),
    pugSync: typeChooserSync('pug'),
    pug: typeChooser('pug'),
    anySync: typeChooserSync('any'),
    any: typeChooser('any'),
    autoSync: typeChooserSync('auto'),
    auto: typeChooser('auto'),
  },
  generateMappingSync,
  generateMapping,
  loadMapping,
  includeConfig,
};
