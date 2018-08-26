# Rename CSS Selectors (RCS)

[![Build Status](https://travis-ci.org/JPeer264/node-rename-css-selectors.svg?branch=master)](https://travis-ci.org/JPeer264/node-rename-css-selectors)
[![Coverage Status](https://coveralls.io/repos/github/JPeer264/node-rename-css-selectors/badge.svg?branch=master)](https://coveralls.io/github/JPeer264/node-rename-css-selectors?branch=master)

> **Note:** Please make sure your files are not minified/uglified. Do that after processing it with `rename-css-selectors`

This module renames all CSS selectors in the given files. It will collect all selectors from the given CSS files. Do not worry about your selectors, `rcs` will do it for you.

You can also use a config file with the combination of [generateMapping](#generateMapping) and [loadMapping](#loadMapping), if you already had other projects with the same classes. So all your projects have the same minified selector names - always.

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [LICENSE](#license)

## Installation

Install with [npm](https://docs.npmjs.com/cli/install) or [yarn](https://yarnpkg.com/en/docs/install)

```sh
npm install --save rename-css-selectors
```
or
```sh
yarn add rename-css-selectors
```

## Usage

With callbacks:

```js
const rcs = require('rename-css-selectors')

// if you have some generated mappings - load them!
// you can also specify the string although it does not exist yet.
rcs.loadMapping('./renaming_map.json')

rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], options, (err) => {
    // all css files are now saved, renamed and stored in the selectorLibrary
    // also other files are not renamed
    // that's it

    // maybe you want to add the new selectors to your previous generated mappings
    // do not worry, your old settings are still here, in case you used `loadMapping`
    rcs.generateMapping('./', { overwrite: true }, (err) => {
        // the mapping file is now saved
    });
});
```

With promises:

```js
const rcs = require('rename-css-selectors');

rcs.loadMapping('./renaming_map.json');

rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], options)
    .then(() => rcs.generateMapping('./', { overwrite: true }))
    .catch(console.error);
```

With async/await:

```js
const rcs = require('rename-css-selectors');

rcs.loadMapping('./renaming_map.json');

(async () => {
    try {
        await rcs.process.auto(['**/*.js', '**/*.html', '**/*.css'], options);
        await rcs.generateMapping('./', { overwrite: true });
    } catch (err) {
        console.error(err);
    }
})();
```


Sync:

```js
const rcs = require('rename-css-selectors');

rcs.loadMapping('./renaming_map.json');

try {
    rcs.process.autoSync(['**/*.js', '**/*.html', '**/*.css'], options);
    rcs.generateMappingSync('./', { overwrite: true });
} catch (err) {
    console.error(err);
}
```

## Methods

- [rcs.process.auto](docs/api/processAuto.md)
- [rcs.process.css](docs/api/processCss.md)
- [rcs.process.js](docs/api/processJs.md)
- [rcs.process.html](docs/api/processHtml.md)
- [rcs.process.any](docs/api/processAny.md)
- [rcs.generateMapping](docs/api/generateMapping.md)
- [rcs.loadMapping](docs/api/loadMapping.md)
- [rcs.includeConfig](docs/api/includeconfig.md)

# LICENSE

MIT © [Jan Peer Stöcklmair](https://www.jpeer.at)
