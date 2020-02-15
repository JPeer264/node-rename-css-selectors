import { fromCallback } from 'universalify';
import fs from 'fs-extra';
import path from 'path';

type Callback = (
  err: null | { message: string } | NodeJS.ErrnoException, successMessage?: string
) => void;

interface SaveOptions {
  overwrite?: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const save = (
  destinationPath: string,
  data: string,
  opts: SaveOptions | Callback,
  cb?: Callback,
) => {
  // @todo check if the filepath has an .ext
  let callback = cb as Callback;
  let options = opts;

  // set cb if options are not set
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (!options.overwrite && fs.existsSync(destinationPath)) {
    return callback({
      message: 'File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.',
    });
  }

  return fs.mkdirs(path.dirname(destinationPath), () => {
    fs.writeFile(destinationPath, data, (err) => {
      if (err) {
        return callback(err);
      }

      return callback(null, `Successfully wrote ${destinationPath}`);
    });
  });
}; // /save

export default fromCallback(save);
