import fs from 'fs-extra';
import path from 'path';

const saveSync = (destinationPath, data, options = {}) => {
  if (!options.overwrite && fs.existsSync(destinationPath)) {
    throw new Error('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
  }

  fs.mkdirsSync(path.dirname(destinationPath));
  fs.writeFileSync(destinationPath, data);
}; // /saveSync

export default saveSync;
