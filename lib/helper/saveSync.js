const fs = require('fs-extra');
const path = require('path');

const saveSync = (destinationPath, data, options = {}) => {
  if (!options.overwrite && fs.existsSync(destinationPath)) {
    throw new Error('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
  }

  try {
    fs.mkdirsSync(path.dirname(destinationPath));
    fs.writeFileSync(destinationPath, data);
  } catch (err) {
    throw err;
  }
}; // /saveSync

module.exports = saveSync;
