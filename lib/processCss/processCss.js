

const rcsProcess = require('../process/process');

/**
 * process over all css files - set and replace
 * does exactly the same as renameCssSelectors.process, but set the collectSelectors option to true
 *
 * @param  {pathString}         pathString this pathString can be either an expression for `glob` or a filepath
 * @param  {processOptions}     options
 * @param  {Function} cb        the callback
 * @return {Function} cb
 */
const processCss = (pathString, options, cb) => {
  // set cb if options are not set
  if (typeof cb !== 'function') {
    cb = options;
    options = {};
  }

  // set the css power for renameCssSelectors.process
  options.collectSelectors = true;

  rcsProcess(pathString, options, cb);
}; // /processCss

module.exports = processCss;
