

const _ = require('lodash');
const rcs = require('rcs-core');
const json = require('json-extra');

/**
 * load the mapping file
 *
 * @param  {Object | String} pathString could be either the path or the mapping object
 * @param  {Object}          [options]
 */
const loadMapping = (pathString, options) => {
  let selectors = pathString;

  const optionsDefault = {
    origValues: true,
  };

  options = options || {};
  options = _.merge(optionsDefault, options);

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
