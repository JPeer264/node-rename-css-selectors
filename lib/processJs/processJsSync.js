const processSync = require('../process/processSync');

const processJsSync = (pathString, options) => {
  options = options || {};

  options.replaceJs = true;

  processSync(pathString, options);
}; // /processJsSync

module.exports = processJsSync;
