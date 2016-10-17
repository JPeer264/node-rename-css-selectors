'use strict';

/**
 * @todo  import options
 */

const rcs = module.exports = {};

const doRequire = name => {
    return rcs[name] = require('./options/' + name);
};

doRequire('fileReplace');
doRequire('nameGenerator');
doRequire('selectorLibrary');
