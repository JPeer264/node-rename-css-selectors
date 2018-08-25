# process

**process(src[, options][, callback])**

> **Important!** processCss should run first, otherwise there are no minified selectors

> *Note:* JavaScript, HTML and CSS files are detected automatically. If you want to make sure that JavaScript files or others are detected correctly. You can use `processJs` for JavaScript files manually to ensure a correct renaming within files.

Not supported files matches all strings `" "` or `' '` and replaces all matching words which are the same as the stored CSS selectors.

Sync: `processSync`

Parameters:
- src `<String | Array>`
- options `<Object>` *optional*
- callback `<Function>` *optional*

Options:

- overwrite (boolean): ensures that it does not overwrite the same file accidently. Default is `false`
- cwd (string): the working directory in which to serach. Default is `process.cwd()`
- newPath (string): in which folder the new files should go. Default is `rcs`

Example:

```js
const rcs = require('rename-css-selectors');

// callback
rcs.process('**/*.js', options, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Successfully wrote new files');
});

// promise
rcs.process('**/*.js', options)
  .then(() => console.log('Successfully wrote new files'))
  .catch(console.error);

// async/await
(async () => {
  try {
    await rcs.process('**/*.js', options);

    console.log('Successfully wrote new files');
  } catch (err) {
    console.log(err);
  }
});
```
