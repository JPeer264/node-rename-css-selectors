import { fromPromise } from 'universalify';
import fs from 'fs-extra';
import path from 'path';

interface SaveOptions {
  overwrite?: boolean;
}

const save = async (
  destinationPath: string,
  data: string,
  options: SaveOptions = {},
): Promise<void> => {
  // @todo check if the filepath has an .ext
  if (!options.overwrite && fs.existsSync(destinationPath)) {
    throw new Error('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
  }

  await fs.mkdirs(path.dirname(destinationPath));
  await fs.writeFile(destinationPath, data);
}; // /save

export default fromPromise(save);
