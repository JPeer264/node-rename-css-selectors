import rcsProcessSync from '../processSync';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const typeChooserSync = (processType: 'css' | 'js' | 'html' | 'pug' | 'any' | 'auto') => (
  (pathString: string, opts: any) => {
    const options = opts || {};
    // set the type for process
    options.type = processType;

    return rcsProcessSync(pathString, options);
  }
); // /typeChooserSync

export default typeChooserSync;
