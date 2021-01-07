# rcs.mapping

## Methods
- [generate](#generate)
- [load](#load)

### generate

**rcs.mapping.generate(pathLocation[, options][, callback])**

> *Note:* if you are using the options either `cssMapping` or `cssMappingMin` must be set to true. Both to `true` at the same time are not valid.

Generates mapping files: all minified, all original selectors or both. They are stored as object in a variable. The file is named as `renaming_map.json` or `renaming_map_min.json`.

Parameters:
- pathLocation `<String>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- fileName `<String>`: alternative filename. Default `renaming_map` or `renaming_map_min` if `origValues: true`
- json `<Boolean>`: writes a `json` instead of a `js`. Default `true`
- overwrite `<Boolean>`: if it should overwrite the existing mapping. Default `false`
- origValues `<Boolean>`: if `false` it the keys and values are switched: `keys` are the minified values. Default `false`

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.generateMapping('./mappings', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote mapping files');
};

// promise
rcs.generateMapping('./mappings', options)
  .then(() => console.log('Successfully wrote mapping files))
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.generateMapping('./mappings', options);

    console.log('Successfully wrote mapping files');
  } catch (err) {
    console.error(err);
  }
})();
```

Output in `renaming_map_min.js`:

```js
const CSS_NAME_MAPPING_MIN = {
  '.e': 'any-class',
  '.t': 'another-class'
};
```

### load

**rcs.mapping.load(mapping[, options])**

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

// load is synchronous
// the first parameter can be either a string to the file
// or the json object directly
await rcs.mapping.load('./renaming_map.json', options);
// or
rcs.mapping.load({ selectors: {} }, options);

rcs.process('**/*.html', (err) => {
  ...
});
```
