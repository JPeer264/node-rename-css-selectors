// process
const typeChooserSync = require('./process/typeChooser/typeChooserSync');
const typeChooser = require('./process/typeChooser/typeChooser');

// mapping
const generateMappingSync = require('./mapping/generateMappingSync');
const generateMapping = require('./mapping/generateMapping');
const loadMapping = require('./mapping/loadMapping');

// config
const includeConfig = require('./config/includeConfig');

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
