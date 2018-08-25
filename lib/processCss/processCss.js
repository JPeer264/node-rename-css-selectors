const { fromCallback } = require('universalify');
const rcsProcess = require('../process/process');

const processCss = (pathString, options, cb) => {
  if (typeof cb !== 'function') {
    cb = options;
    options = {};
  }

  // set the css power for renameCssSelectors.process
  options.collectSelectors = true;

  rcsProcess(pathString, options, cb);
}; // /processCss

module.exports = fromCallback(processCss);
