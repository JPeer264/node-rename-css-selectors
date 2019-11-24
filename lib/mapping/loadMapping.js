const merge = require('lodash.merge');
const rcs = require('rcs-core');
const json = require('json-extra');

const loadReversed = selectors =>
  Object.entries(selectors).reduce(
    (prev, [key, value]) => merge(prev, { [key.charAt(0) + value]: key.slice(1, key.length) })
    , {});

const loadMapping = (pathString, options = {}) => {
  let selectors = pathString;

  const optionsDefault = {
    origValues: true,
  };

  // eslint-disable-next-line no-param-reassign
  options = merge({}, optionsDefault, options);

  if (typeof pathString === 'string') {
    selectors = json.readToObjSync(pathString, 'utf8');
  }

  let classes = selectors.class || {};
  let ids = selectors.id || {};

  if (!options.origValues) {
    classes = loadReversed(classes);
    ids = loadReversed(ids);
  }

  if (!selectors || typeof selectors !== 'object') {
    return;
  }

  rcs.default.selectorsLibrary.getClassSelector().setMultiple(classes);
  rcs.default.selectorsLibrary.getIdSelector().setMultiple(ids);
}; // /loadMapping

module.exports = loadMapping;
