# Rename CSS Selectors (RCS)

[![Build Status](https://travis-ci.org/JPeer264/node-rename-css-selectors.svg?branch=master)](https://travis-ci.org/JPeer264/node-rename-css-selectors)
[![Coverage Status](https://coveralls.io/repos/github/JPeer264/node-rename-css-selectors/badge.svg?branch=master)](https://coveralls.io/github/JPeer264/node-rename-css-selectors?branch=master)

> **Note:** Please make sure your files are not minified/uglified. Do that after processing it with `rename-css-selectors`

This module renames all CSS selectors in the given files. It will collect all selectors from the given CSS files. Do not worry about your selectors, `rcs` will do it for you.

You can also use a config file with the combination of [generateMapping](#generateMapping) and [loadMapping](#loadMapping), if you already had other projects with the same classes. So all your projects have the same minified selector names - always.

This is a plugin of [rcs-core](https://github.com/JPeer264/node-rcs-core)

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [Caveats](#caveats)
- [LICENSE](#license)

## Installation

Install with [npm](https://docs.npmjs.com/cli/install) or [yarn](https://yarnpkg.com/en/docs/install)

```sh
npm i rename-css-selectors rcs-core
```
or
```sh
yarn add rename-css-selectors rcs-core
```

## Usage

Async:

> There are 3 different ways of writing async `rcs` code: callbacks, promises and async/await

```js
// you can use every method of `rcs-core` on top
const rcsCore = require('rcs-core');
const rcs = require('rename-css-selectors')

// if you want to include the .rcsrc config
rcs.config.load();

// if you have some generated mappings - load them!
// you can also specify the string although it does not exist yet.
rcs.mapping.load('./renaming_map.json');

// now with rcsCore you could e.g. ignore single variables (optional)
rcsCore.baseLibrary.setExclude(/<%=[\s\S]+%>/);

// callback
rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], options, (err) => {
    // all css files are now saved, renamed and stored in the selectorLibrary
    // also other files are not renamed
    // that's it

    // maybe you want to add the new selectors to your previous generated mappings
    // do not worry, your old settings are still here, in case you used `rcs.mapping.load`
    rcs.mapping.generate('./', { overwrite: true }, (err) => {
        // the mapping file is now saved
    });
});

// promise
rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], options)
    .then(() => rcs.mapping.generate('./', { overwrite: true }))
    .catch(console.error);

// async/await
(async () => {
    try {
        await rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], options);
        await rcs.mapping.generate('./', { overwrite: true });
    } catch (err) {
        console.error(err);
    }
})();
```

Sync:

```js
const rcs = require('rename-css-selectors');

rcs.mapping.load('./renaming_map.json');

try {
    rcs.process.autoSync(['**/*.js', '**/*.html', '**/*.css'], options);
    rcs.mapping.generateSync('./', { overwrite: true });
} catch (err) {
    console.error(err);
}
```

## Methods

- [rcs.process.auto](docs/api/processAuto.md)
- [rcs.process.css](docs/api/processCss.md)
- [rcs.process.js](docs/api/processJs.md)
- [rcs.process.html](docs/api/processHtml.md)
- [rcs.process.pug](docs/api/processPug.md)
- [rcs.process.any](docs/api/processAny.md)
- [rcs.mapping](docs/api/mapping.md)
- [rcs.config](docs/api/config.md)

## Caveats

Correctly using `rename-css-selectors` on large project means few rules should be followed.
[This document](https://github.com/JPeer264/node-rcs-core/blob/main/docs/caveats.md) explains most of them.

# LICENSE

MIT © [Jan Peer Stöcklmair](https://www.jpeer.at)
