'use strict';

const processSync = require('../process/processSync');

/**
 * The ansynchronous method for processCss
 */
const processJsSync = (pathString, options) => {
  options = options || {};

  options.replaceJs = true;

  processSync(pathString, options);
}; // /processJsSync

module.exports = processJsSync;
