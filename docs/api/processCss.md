# rcs.process.css

**rcs.process.css(src[, options][, callback])**

Store all matched selectors into the library and saves the new generated file with all renamed selectors.

Sync: `process.cssSync`

Parameters:
- src `<String | Array>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- optimize `<Boolean>`: checks if the selectors should be [optimized](https://github.com/JPeer264/node-rcs-core/blob/main/docs/api/optimize.md). Default is `true`
- *all options of [rcs.process](process.md)*
- *plus options [rcsCore.fillLibrary](https://github.com/JPeer264/node-rcs-core/blob/master/docs/api/filllibraries.md)*

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.process.css('**/*.css', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new files and stored values');
});

// promise
rcs.process.css('**/*.css', options)
  .then(() => console.log('Successfully wrote new files and stored values'));
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.process.css('**/*.css', options);

    console.log('Successfully wrote new files and stored values')
  } catch (err) {
    console.error(err);
  }
})();
```
