// process
import typeChooserSync from './process/typeChooser/typeChooserSync';
import typeChooser from './process/typeChooser/typeChooser';

// mapping
import generateMappingSync from './mapping/generateMappingSync';
import generateMapping from './mapping/generateMapping';
import loadMapping from './mapping/loadMapping';

// config
import Config from './Config';

export default {
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
  Config,
};
