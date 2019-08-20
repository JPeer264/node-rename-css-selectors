const merge = require('lodash.merge');
const rcs = require('rcs-core');
const json = require('json-extra');

function loadReversed(selectors) {
    const tempSelectors = {};

    Object.keys(selectors).forEach((key) => {
      const value = selectors[key];
      const modKey = key.slice(1, key.length);

      tempSelectors[key.charAt(0) + value] = modKey;
    });

    return tempSelectors;
}

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

  let classes = selectors.class || {};
  let ids = selectors.id || {};

  if (!options.origValues) {
    classes = loadReversed(classes);
    ids = loadReversed(ids);
  }

  if (!selectors || typeof selectors !== 'object') {
    return;
  }

  rcs.selectorsLibrary.getClassSelector().setMultiple(classes);
  rcs.selectorsLibrary.getIdSelector().setMultiple(ids);
}; // /loadMapping

module.exports = loadMapping;
