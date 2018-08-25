# processJs

**process(src[, options][, callback])**

> **Important!** processCss should run first, otherwise there are no minified selectors

Sync: `processJsSync`

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
rcs.processJs('**/*.js', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new javascript files');
});

// promise
rcs.processJs('**/*.js', options)
  .then(() => console.log('Successfully wrote new javascript files'))
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.processJs('**/*.js', options);

    console.log('Successfully wrote new javascript files');
  } catch (err) {
    console.error(err);
  }
})();
```
