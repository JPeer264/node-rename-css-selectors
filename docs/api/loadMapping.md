# loadMapping

**loadMapping(mapping[, options])**

> *Note:* If you include a file, it **MUST** be the json generated mapping.

Loads the previous generated mapping. This ensures that all your projects have all the time the same renamed selectors.

Parameters:
- mapping `<String | Mapping>`: can be either a path to the mapping or a mapping object
- options `<Object>` *optional*

Options:

- origValues (boolean): Wether the cssMappingMin (`false`) or cssMapping (`true`) should get loaded. Default is `true`

Example:

```js
const rcs = require('rename-css-selectors');

// loadMapping is synchronous
// the first parameter can be either a string to the file
// or the json object directly
await rcs.loadMapping('./renaming_map.json', options);
// or
rcs.loadMapping({ selectors: {} }, options);

rcs.process('**/*.html', (err) => {
  ...
});
```
