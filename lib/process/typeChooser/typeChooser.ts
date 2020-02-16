import { fromCallback } from 'universalify';
import rcsProcess from '../process';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const typeChooser = (processType: 'css' | 'js' | 'html' | 'pug' | 'any' | 'auto') => (
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

export default typeChooser;
