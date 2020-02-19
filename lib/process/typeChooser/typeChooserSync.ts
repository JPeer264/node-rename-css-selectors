import rcsProcessSync from '../processSync';
import { AllOptions } from '../process';

function typeChooserSync(processType: 'pug'): (pathString: string, opts: AllOptions['html']) => void;
function typeChooserSync(processType: 'any'): (pathString: string, opts: AllOptions['any']) => void;
function typeChooserSync(processType: 'js'): (pathString: string, opts: AllOptions['js']) => void;
function typeChooserSync(processType: 'html'): (pathString: string, opts: AllOptions['html']) => void;
function typeChooserSync(processType: 'css'): (pathString: string, opts: AllOptions['css']) => void;
function typeChooserSync(processType: 'auto'): (pathString: string, opts: AllOptions['auto']) => void;
function typeChooserSync(processType: any): any {
  return (pathString: string, opts: any) => {
    const options = opts || {};
    // set the type for process
    (options as any).type = processType;

    rcsProcessSync(pathString, options as any);
  };
} // /typeChooserSync

export default typeChooserSync;
