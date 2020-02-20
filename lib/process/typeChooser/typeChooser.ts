import rcsProcess, { AllOptions } from '../process';

/**
 * typeChooser will be obsolete as soon as
 * `process.bind(null, 'js')` works with TypeScript method overloads
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html#caveats
 * "[...] when used on a function with overloads, only the last overload will ever be modeled."
 */
function typeChooser(processType: 'pug'): (pathString: string | string[], opts?: AllOptions['pug']) => Promise<void>;
function typeChooser(processType: 'any'): (pathString: string | string[], opts?: AllOptions['any']) => Promise<void>;
function typeChooser(processType: 'js'): (pathString: string | string[], opts?: AllOptions['js']) => Promise<void>;
function typeChooser(processType: 'html'): (pathString: string | string[], opts?: AllOptions['html']) => Promise<void>;
function typeChooser(processType: 'css'): (pathString: string | string[], opts?: AllOptions['css']) => Promise<void>;
function typeChooser(processType: 'auto'): (pathString: string | string[], opts?: AllOptions['auto']) => Promise<void>;
function typeChooser(processType: any): any {
  return (...args: any) => rcsProcess(processType, ...args);
} // /typeChooser

export default typeChooser;
