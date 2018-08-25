const { fromCallback } = require('universalify');
const rcsProcess = require('../process/process');

const processJs = (pathString, options, cb) => {
  if (typeof cb !== 'function') {
    cb = options;
    options = {};
  }

  // set the css power for renameCssSelectors.process
  options.replaceJs = true;

  rcsProcess(pathString, options, cb);
}; // /processJs

module.exports = fromCallback(processCss);
