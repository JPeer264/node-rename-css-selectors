import { fromCallback } from 'universalify';
import rcsProcess from '../process';

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

export default typeChooser;
