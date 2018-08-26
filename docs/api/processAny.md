# rcs.process.any

**rcs.process.any(src[, options][, callback])**

> **Important!** process.any should run first, otherwise there are no minified selectors

Matches all strings (`" "` or `' '`) and replaces all matching words which are the same as the stored CSS selectors.

Sync: `process.anySync`

Parameters:
- src `<String | Array>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- *all options of [rcs.process](process.md)*

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.process.any('**/*.txt', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new files and stored values');
});

// promise
rcs.process.any('**/*.txt', options)
  .then(() => console.log('Successfully wrote new files and stored values'));
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.process.any('**/*.txt', options);

    console.log('Successfully wrote new files and stored values')
  } catch (err) {
    console.error(err);
  }
})();
```
