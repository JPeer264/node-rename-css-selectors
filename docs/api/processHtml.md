# rcs.process.html

**rcs.process.html(src[, options][, callback])**

> **Important!** process.css should run first, otherwise there are no minified selectors

Sync: `process.htmlSync`

Parameters:
- src `<String | Array>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- optimize `<Boolean>`: checks if the selectors should be [optimized](https://github.com/JPeer264/node-rcs-core/blob/main/docs/api/optimize.md). Default is `true`
- *all options of [rcs.process](process.md)*
- *plus options [rcsCore.replace.html](https://github.com/JPeer264/node-rcs-core/blob/master/docs/api/replace.md#html)*

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.process.html('**/*.html', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new HTML files');
});

// promise
rcs.process.html('**/*.html', options)
  .then(() => console.log('Successfully wrote new HTML files'))
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.process.html('**/*.html', options);

    console.log('Successfully wrote new HTML files');
  } catch (err) {
    console.error(err);
  }
})();
```
