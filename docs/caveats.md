# Using rename-css-selectors correctly and patterns to avoid

`rename-css-selectors` is using `rcs-core` to perform its CSS selectors optimization.
The core is performing three steps on your files:
1. Extracting CSS's class and id selectors, keyframes, variables and attributes selectors
2. Assigning minified value for each entry it has found
3. Trying to replace all elements that could match in your files with the minified version

## Caveats for step 1

> **tl;dr:** Selectors are just renamed if they appear in your CSS

Currently, the first step is done on CSS syntax only (either from CSS files or extracted from HTML's `<style>` tags).
This means that if you have some HTML code doing this:

```html
<div class='something'>[...]</div>
<div class='something'>[...]</div>
```

without a CSS rule for class's `something`, it'll not be replaced/minified.
In the future, the core might add a notice for these cases.

HTML replacement should be quite solid for now, since the core can inspect attribute's name and only act upon `class` and `id` (and label's `for`).

## Caveats for step 2

> **tl;dr:** Do not name your selectors like standard HTML attributes. Such selectors are [excluded by default](https://github.com/JPeer264/node-rcs-core/blob/master/lib/helpers/excludeList.ts)

It's very important that the assigned *minified* name for each entry does not collide with a valid CSS selector that you could encounter.
Paradoxically, if your initial selectors are very large, you'll have less chances to encounter an issue. Using `rename-css-selectors` in your pipeline should encourage more meaningful selectors in your file.

By default, the core tries to minimize the length of the mapped minified name's selector. So if you have a CSS selector in your code like `.something`, it'll be mapped to (for example), `.a` if available.
If you already have a small selector (like `.b`), the core is smart enough to map it to a similar length's selector (but not necessarly `.b`, it can be `.t`). When all first letter selectors are used, it's generating two letter selectors and so on.

As you'll see in the next section, because of JavaScript's openness, some selectors can be understood differently.

Imagine you have such document:
```html
<style>
  .b { color: red; }
  b { color: blue; }
</style>

<div class='b'>
  <b>Yeah</b>
</div>

<script>
  const a = 'b';
  const c = document.querySelector(a);
  const d = document.getElementsByClassName(a);
</script>
```
Here, the *key* `'b'` in the JavaScript code can refer to the tag name `<b>` (when being called by `document.querySelector`) or to the class `.b` (when being called by `document.getElementsByClassName`.
The core does not run your code (it only parses it) and, as such, can't figure out when a variable is being used for the former or latter case.
Please notice that the core can't expect a *class* selection by looking at `getElementsByClassName` since you can be using any library that's abstracting this (like jQuery, React...).

So, to avoid this caveat, you can either:
* Avoid conflicting class name with potential HTML tag name (don't name your CSS class like `.b` or `.i` or `.span`, ...)
* Avoid using `getElementById`, `getElementsByClassName` in your JavaScript code (and only fallback to `querySelector` and `querySelectorsAll`)
* Reserve some mapping so the core can't use them (check the `config.reserve` array in the documentation about how to do that)
* Exclude any selector that's conflicting with any HTML tag name (check the `config.exclude` array in the documentation about how to do that)


### Warning:

In the example above, `<div class='b'>` can be what the core is generating for your initial class `something`. So the example above could have been generated from this source:

```html
<style>
  .something { color: red; }
  b { color: blue; }
</style>
<div class='something'>
  <b>Yeah</b>
</div>
<script>
  const a = 'something';
  const c = document.querySelector(a);
  const d = document.getElementsByClassName(a);
</script>
```
In that case, the initial code is semantically wrong since the `querySelector` should return `undefined`. The minified CSS selector code will thus return a different result in that case.

If you had followed the advice above and excluded (or reserved) all potential HTML tag name (see below), then `something` won't be mapped to `b`, but, for example, `t` and the initial code behavior will be preserved.

Similarly, if your initial code was:
```js
...
const a = 'b';
...
```
then the core will generate a warning telling you that `b` is already used in the renaming map and that you should fix the ambiguity.

By default all HTML and CSS attributes are excluded, see [here](https://github.com/JPeer264/node-rcs-core/blob/master/lib/helpers/excludeList.ts)

The incovenient being that such selectors won't be minified (think about `header` for example, it's quite common for a class name)

## Caveat for step 3

> **tl;dr:** Be careful with CSS selectors in JavaScript. Do not use string concatenation with your CSS selectors.

Replacement is relatively safe for CSS and HTML (again, because such format are explicit enough to avoiding ambiguity).

Replacements inside JavaScript code is much harder because a string for a selector can be generated from many small parts (like in `const a = '.' + objClass;`), can be used in functions that have different semantics (like `getElementById` and `querySelector`), etc...

So, here's the way the core is trying to resolve ambiguities (but as seen above, not all ambiguities can be solved):

1. ECMAScript template, like in ``const a = `some text ${jsConst}`;`` is parsed like HTML, looking for `class="X"` or `id='Y'` or `for="Z"`.
   If you use template code to make your CSS selector from each part, it'll fail:
   Don't write ``const myClass = 'something'; const sel = `.${myClass}`;``, but instead `const myClass = '.something'`.

2. Each string literal is extracted from your JavaScript code and:
    - If it contains some CSS specific selectors chars (like `#` or `.` or ` ` etc...), then it's parsed as a CSS selector. **This is safer and usually gives the expected result.**
    - If it does not contain some CSS specific selectors (like a single word), then it's tried as an ID selector first and if not found as a class selector (or not replaced if not found in either one).
    **This can lead to the ambiguity shown above.**

So, to avoid such ambiguity, try to store your class or id with their respective prefix (`.` or `#`) in your code, and rely on `querySelector` et al.

For example, here are some replacement selected by the library, with these CSS selector:

```css
.something {} /* Mapped to .a */
#test {}      /* Mapped to #a */
.test {}      /* Mapped to .b */
```
| Initial code | Replaced code | Reason |
|---|---|---|
|`const a = 'something';`|`const a = 'b';`| The core could not deduce the string literal is a selector, so fallback to searching for any rule with `something`, class had one|
|`const a = 'test';`|`const a = 'a';`| The core could not deduce the string literal is a selector and in fallback to search for any rule, it selected #test=>#a since it was searched first|
|`const a = '.something';`|`const a = '.a';`| The core deduced a class selector was required and replaced it|
|`const a = '.test';`|`const a = '.b';`| The core deduced a class selector was required and replaced it|
|`const a = ' something';`|`const a = ' something';`| The core deduced the string literal is a CSS selector, but could not find any match|
|`const a = 'div[class=something]';`|`const a = 'div[class=a]';`| The core deduced the attribute selector was related to a class selector and replaced it|
|`const a = 'input[name=something]';`|`const a = 'input[name=something]';`| The core deduced the attribute selector wasn't related to a class, id or for attribute, no replacement was done|
|`const a = 'b #test, .something';`|`const a = 'b #a, .a';`| The core parsed all selectors and produced correct replacement for each of them|

### Another remark:
Some are writing CSS selector this way:
```css
div[class = something]
{
color: red;
}
```
This is perfectly safe from JavaScript code (if you have `const a = 'div[class=something]';`), then this will be replaced correctly by the core (*to* `const a = 'div[class=b]';`).

This however requires much more work from the developper so this is not a solution we recommend.
