# includeConfig

**includeConfig([pathLocation])**

> All available configs [here](#rcs-config)

RCS will lookup first for a `.rcsrc` of the current directory. If there is no such file, it will lookup for a `package.json` with a `"rcsrc": {}` in it. You can also write any path in the parameters and write your own config file. This function is synchronous.

Parameters:
- pathLocation `<String>` *optional*

Example:

```js
const rcs = require('rename-css-selectors');

rcs.includeConfig();
```

## RCS config

> Just create a `.rcsrc` in your project root or you can add everything in your `package.json` with the value `rcs`

- [Example](#example)
- [Exclude](#exclude-classes-and-ids)
- [Include from other projects](#include-renamed-classes-from-other-project)

### Example

The `.rcsrc` or the a own config file:

```json
{
    "exclude": [
        "js",
        "flexbox"
    ]
}
```

The `package.json`:

```json
{
    "name": "Your application name",
    "rcs": {
        "exclude": [
            "js",
            "flexbox"
        ]
    }
}
```

### Exclude Classes and IDs

`exclude`

What if you are using something such as Modernizr and you do not want to minify some selectors?

Let's exclude 4 classes and id's: `js`, `flexbox`, `canvas` and `svg`

```json
{
    "exclude": [
        "js",
        "flexbox",
        "canvas",
        "svg"
    ]
}
```
