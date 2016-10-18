'use strict';

/**
 * @todo  parse files and rename
 */
const rcs = require('./utils/rcs');

for (var i = 0; i < 100; i++) {
    console.log(rcs.nameGenerator.generate());
}
