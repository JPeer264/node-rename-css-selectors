import rcs from 'rcs-core';
import path from 'path';
import json from 'json-extra';

const include = (pathString = path.join(process.cwd(), '.rcsrc')): void => {
  let configObject;

  configObject = json.readToObjSync(pathString);

  if (!configObject) {
    // package.json .rcs if no other config is found
    configObject = json.readToObjSync(path.join(process.cwd(), 'package.json')).rcs;
  }

  if (configObject.exclude) {
    rcs.selectorsLibrary.setExclude(configObject.exclude);
  }
}; // /include

export default include;
