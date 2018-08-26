const rcsProcessSync = require('../processSync');

const typeChooserSync = processType => (
  (pathString, opts) => {
    const options = opts || {};
    // set the type for process
    options.type = processType;

    return rcsProcessSync(pathString, options);
  }
); // /typeChooserSync

module.exports = typeChooserSync;
