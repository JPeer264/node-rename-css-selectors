const rcs = require('rcs-core');
const path = require('path');
const json = require('json-extra');

/**
 * includes .rcsrc - if not found it will include "rcs" in package.json
 */
const include = (pathString = path.join(process.cwd(), '.rcsrc')) => {
  let configObject;

  configObject = json.readToObjSync(pathString);

  if (!configObject) {
    // package.json .rcs if no other config is found
    configObject = json.readToObjSync(path.join(process.cwd(), 'package.json')).rcs;
  }

  if (configObject.exclude) {
    rcs.selectorLibrary.setExclude(configObject.exclude);
  }
}; // /include

module.exports = include;
