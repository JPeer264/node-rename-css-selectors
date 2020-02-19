import { fromCallback } from 'universalify';
import rcsProcess, { AllOptions } from '../process';

function typeChooser(processType: 'pug'): (pathString: string, opts: AllOptions['html']) => Promise<void>;
function typeChooser(processType: 'any'): (pathString: string, opts: AllOptions['any']) => Promise<void>;
function typeChooser(processType: 'js'): (pathString: string, opts: AllOptions['js']) => Promise<void>;
function typeChooser(processType: 'html'): (pathString: string, opts: AllOptions['html']) => Promise<void>;
function typeChooser(processType: 'css'): (pathString: string, opts: AllOptions['css']) => Promise<void>;
function typeChooser(processType: 'auto'): (pathString: string, opts: AllOptions['auto']) => Promise<void>;
function typeChooser(processType: any): any {
  return fromCallback((pathString, opts, cb) => {
    let callback = cb;
    let options = opts;

    if (typeof callback !== 'function') {
      callback = options;
      options = {};
    }

    // set the type for process
    options.type = processType;

    return rcsProcess(pathString, options, callback);
  });
} // /typeChooser

export default typeChooser;
