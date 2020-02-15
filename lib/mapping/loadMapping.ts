import rcs from 'rcs-core';
import json from 'json-extra';

const loadMapping = (pathString: string | { [s: string]: string }, opts = {}): void => {
  let selectors: { [s: string]: string };

  const options = {
    origValues: true,
    ...opts,
  };

  if (typeof pathString === 'string') {
    selectors = json.readToObjSync(pathString, 'utf8');
  } else {
    selectors = pathString;
  }

  if (!options.origValues) {
    const tempSelectors: { [s: string]: string } = {};

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

  rcs.selectorsLibrary.setMultiple(selectors);
}; // /loadMapping

export default loadMapping;
