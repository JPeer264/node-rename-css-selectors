# generateMapping

**generateMapping(pathLocation[, options][, callback])**

> *Note:* if you are using the options either `cssMapping` or `cssMappingMin` must be set to true. Both to `true` at the same time are not valid.

Generates mapping files: all minified, all original selectors or both. They are stored as object in a variable. The file is named as `renaming_map.json` or `renaming_map_min.json`.

Parameters:
- pathLocation `<String>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- cssMapping (string | boolean): writes `renaming_map.json`. If it is a string, the string is the new file name. Default is `true`
- cssMappingMin (string | boolean): writes `renaming_map_min.json`. If it is a string, the string is the new file name. Default is `false`
- extended (boolean): instead of a string it writes an object with meta information. Default is `false`
- json (boolean): writes a `json` instead of a `js. Default is `true`
- overwrite (boolean): if it should overwrite the existing mapping. Default is `false`

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
