'use strict';

/**
 * @todo  import options
 */

const rcs = module.exports = {};

const doRequire = name => {
    return rcs[name] = require('./options/' + name);
};

doRequire('nameGenerator');
doRequire('fileReplace');
doRequire('selectorLibrary');
