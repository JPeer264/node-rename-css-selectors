const merge = require('lodash.merge');
const rcs = require('rcs-core');
const json = require('json-extra');

const loadMapping = (pathString, options) => {
  let selectors = pathString;

  const optionsDefault = {
    origValues: true,
  };

  options = options || {};
  options = merge({}, optionsDefault, options);

  if (typeof pathString === 'string') {
    selectors = json.readToObjSync(pathString, 'utf8');
  }

  if (!options.origValues) {
    const tempSelectors = {};

    Object.keys(selectors).forEach((key) => {
      const value = selectors[key];
      const modKey = key.slice(1, key.length);

      tempSelectors[key.charAt(0) + value] = modKey;
    });

    selectors = tempSelectors;
  }

  if (!selectors || typeof selectors !== 'object') {
    return;
  }

  rcs.selectorLibrary.setMultiple(selectors);
}; // /loadMapping

module.exports = loadMapping;
