const rcs = require('rcs-core');
const path = require('path');
const json = require('json-extra');

const include = (pathString = path.join(process.cwd(), '.rcsrc')) => {
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

module.exports = include;
