# rcs.process.pug

**rcs.process.pug(src[, options][, callback])**

> **Important!** process.css should run first, otherwise there are no minified selectors

Sync: `process.pugSync`

Parameters:
- src `<String | Array>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- *all options of [rcs.process.html](processHtml.md)*

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.process.pug('**/*.pug', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new pug files');
});

// promise
rcs.process.pug('**/*.pug', options)
  .then(() => console.log('Successfully wrote new pug files'))
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.process.pug('**/*.pug', options);

    console.log('Successfully wrote new pug files');
  } catch (err) {
    console.error(err);
  }
})();
```
