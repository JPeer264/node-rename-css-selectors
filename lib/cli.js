'use strict';

/**
 * @todo  parse files and rename
 */
const rcs = require('./utils/rcs');

rcs.fileReplace.replaceCss('test/files/results/style.css', (err, data) => {
    console.log(data);
});
