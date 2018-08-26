# rcs.process.js

**rcs.process.js(src[, options][, callback])**

> **Important!** process.css should run first, otherwise there are no minified selectors

Sync: `process.jsSync`

Parameters:
- src `<String | Array>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- *all options of [rcs.process](process.md)*
- *plus options [rcsCore.replace.js](https://github.com/JPeer264/node-rcs-core/blob/master/docs/api/replace.md#js)*

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.process.js('**/*.js', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new JavaScript files');
});

// promise
rcs.process.js('**/*.js', options)
  .then(() => console.log('Successfully wrote new JavaScript files'))
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.process.js('**/*.js', options);

    console.log('Successfully wrote new JavaScript files');
  } catch (err) {
    console.error(err);
  }
})();
```
