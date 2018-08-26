const { fromCallback } = require('universalify');
const rcsProcess = require('../process');

const typeChooser = processType => (
  fromCallback((pathString, opts, cb) => {
    let callback = cb;
    let options = opts;

    if (typeof callback !== 'function') {
      callback = options;
      options = {};
    }

    // set the type for process
    options.type = processType;

    return rcsProcess(pathString, options, callback);
  })
); // /typeChooser

module.exports = typeChooser;
