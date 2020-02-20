import rcsProcessSync from '../processSync';
import { AllOptions } from '../process';

function typeChooserSync(processType: 'pug'): (pathString: string | string[], opts?: AllOptions['html']) => void;
function typeChooserSync(processType: 'any'): (pathString: string | string[], opts?: AllOptions['any']) => void;
function typeChooserSync(processType: 'js'): (pathString: string | string[], opts?: AllOptions['js']) => void;
function typeChooserSync(processType: 'html'): (pathString: string | string[], opts?: AllOptions['html']) => void;
function typeChooserSync(processType: 'css'): (pathString: string | string[], opts?: AllOptions['css']) => void;
function typeChooserSync(processType: 'auto'): (pathString: string | string[], opts?: AllOptions['auto']) => void;
function typeChooserSync(processType: any): any {
  return (pathString: any, opts: any) => rcsProcessSync(processType, pathString, opts);
} // /typeChooserSync

export default typeChooserSync;
