# loadMapping

**loadMapping(pathToMapping[, options])**

> *Note:* If you include a file, it **MUST** be the json generated mapping.

Loads the previous generated mapping. This ensures that all your projects have all the time the same renamed selectors.

Parameters:
- pathToMapping `<String>`
- options `<Object>` *optional*

Options:

- origValues (boolean): Wether the cssMappingMin (`false`) or cssMapping (`true`) should get loaded. Default is `true`

Example:

```js
const rcs = require('rename-css-selectors');

// loadMapping is synchronous
// the first parameter can be either a string to the file
// or the json object directly
rcs.loadMapping('./renaming_map.json', options);

rcs.process('**/*.html', (err) => {
  ...
});
```
