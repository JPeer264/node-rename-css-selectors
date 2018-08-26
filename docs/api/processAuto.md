# rcs.process.auto

**rcs.process.auto(src[, options][, callback])**

> *Note:* JavaScript, HTML and CSS files are detected automatically. If you want to make sure that JavaScript files or others are detected correctly, you can use `process.js` for JavaScript files or `process.html` for HTML files manually to ensure a correct renaming within files.

Not supported files are renamed by [`replace.any`](replaceAny.md).

Sync: `process.autoSync`

Parameters:
- src `<String | Array>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- overwrite `<Boolean>`: ensures that it does not overwrite the same file accidently. Default is `false`
- cwd `<String>`: the working directory in which to serach. Default is `process.cwd()`
- newPath `<String>`: in which folder the new files should go. Default is `rcs`

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.process.auto('**/*.js', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new files');
});

// promise
rcs.process.auto('**/*.js', options)
  .then(() => console.log('Successfully wrote new files'))
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.process.auto('**/*.js', options);

    console.log('Successfully wrote new files');
  } catch (err) {
    console.log(err);
  }
});
```
