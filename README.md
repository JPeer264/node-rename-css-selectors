# Rename CSS Selectors

[![Build Status](https://travis-ci.org/JPeer264/rename-css-selectors.svg?branch=master)](https://travis-ci.org/JPeer264/rename-css-selectors)

This library renames all CSS selectors in the given files. It will collect all selectors from the given CSS files, it does not matter if those are `scss` or even plain `css` files.

You can also use a config file, if you already had other projects with the same classes. So all your projects have the same minified selector names - always.

## Installation

Install with npm or yarn

```js
npm install --save rename-css-selectors
```
or
```js
yarn add rename-css-selectors

```

## Usage

```js
const rcs = require('rename-css-selectors')


// first you have to process the css files
// to get a list of variables you want to minify
// options is optional
rcs.processCss('**/*.css', options, err => {
    // all css files are now saved and renamed

    // now it is time to process all other files
    rcs.process('**/*.js', options, err => {
        // that's it
    });
});
```

## Methods

- [processCss](#processcss)
- [process](#process)
- [generateLibraryFile](#generatelibraryfile)

### processCss

**processCss(src, [options], callback)**

Store all matched selectors into the library and saves the new generated file with all renamed selectors.

Options:

- overwrite (boolean): ensures that it does not overwrite the same file accidently. Default is `false`
- cwd (string): the working directory in which to seach. Default is `process.cwd()`
- newPath (string): in which folder the new files should go. Default is `rcs`
- flatten (boolean): flatten the hierarchie - no subfolders. Default is `false`

Example:

```js
const rcs = require('rename-css-selectors')

rcs.processCss('**/*.css', options, err => {
    if (err) return console.error(err)

    console.log('Successfully wrote new files and stored values');
}
```

### process

**process(src, [options], callback)**

### generateLibraryFile

**generateLibraryFile(pathLocation, [options], callback)**