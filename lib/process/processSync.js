'use strict';

const fs    = require('fs');
const rcs   = require('rcs-core');
const path  = require('path');
const glob  = require('glob');

/**
 * The synchronous method for process
 */
const processSync = (pathString, options) => {
    const optionsDefault = {
        collectSelectors: false,
        overwrite: false,
        cwd: process.cwd(),
        newPath: 'rcs',
        flatten: false
    };

    let globString = pathString;

    if (Object.prototype.toString.call(pathString) === '[object Array]') {
        globString = `{${ pathString.join(',') }}`;
    }

    const globArray = glob.sync(globString, {
        cwd: options.cwd
    });

    // call replaceCss if options.collectSelectors is set to true
    for (let filePath of globArray) {
        let data;
        let joinedPath      = path.join(options.newPath, filePath);
        let shouldOverwrite = options.overwrite;

        if (!options.overwrite) {
            shouldOverwrite = joinedPath !== path.join(options.cwd, filePath);
        }

        if (options.collectSelectors) {
            data = rcs.replace.bufferCss(fs.readFileSync(path.join(options.cwd, filePath)), options);
        } else if (options.replaceJS) {
            data = rcs.replace.bufferJs(fs.readFileSync(path.join(options.cwd, filePath)), options);
        } else {
            data = rcs.replace.buffer(fs.readFileSync(path.join(options.cwd, filePath)), options);
        }

        rcs.helper.saveSync(joinedPath, data, { overwrite: shouldOverwrite });
    }
}; // /processSync

module.exports = processSync;
