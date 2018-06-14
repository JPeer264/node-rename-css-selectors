

const processSync = require('../process/processSync');

/**
 * The ansynchronous method for processCss
 */
const processCssSync = (pathString, options) => {
  options = options || {};

  // set the css power for renameCssSelectors.process
  options.collectSelectors = true;

  processSync(pathString, options);
}; // /processCssSync

module.exports = processCssSync;
