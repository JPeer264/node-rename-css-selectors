# processCss

**processCss(src[, options][, callback])**

Store all matched selectors into the library and saves the new generated file with all renamed selectors.

Sync: `processCssSync`

Parameters:
- src `<String | Array>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- *all options of [rcs.process](process.md)*
- *plus options [rcsCore.fillLibrary](https://github.com/JPeer264/node-rcs-core/blob/master/docs/api/filllibraries.md)*

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.processCss('**/*.css', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new files and stored values');
});

// promise
rcs.processCss('**/*.css', options)
  .then(() => console.log('Successfully wrote new files and stored values'));
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.processCss('**/*.css', options);

    console.log('Successfully wrote new files and stored values')
  } catch (err) {
    console.error(err);
  }
})();
```
