'use strict';

/**
 * @todo  import options
 */

const rcs = module.exports = {};

const doRequire = name => {
    return rcs[name] = require('./options/' + name);
};

doRequire('helper');
doRequire('nameGenerator');
doRequire('selectorLibrary');
doRequire('replace');
