import rcsProcessSync from '../processSync';

const typeChooserSync = processType => (
  (pathString, opts) => {
    const options = opts || {};
    // set the type for process
    options.type = processType;

    return rcsProcessSync(pathString, options);
  }
); // /typeChooserSync

export default typeChooserSync;
