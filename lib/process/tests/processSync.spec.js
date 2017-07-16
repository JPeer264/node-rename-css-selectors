'use strict';

const processSync = require('../processSync');
const processCssSync = require('../../processCss/processCssSync');

const fs     = require('fs-extra');
const rcs    = require('rcs-core');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('process/processSync', () => {
    beforeEach(() => {
        rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
        rcs.nameGenerator.reset();
        rcs.selectorLibrary.reset();
        rcs.keyframesLibrary.reset();
    });

    afterEach(() => {
        fs.removeSync(testCwd);
    });

    it('should process all files synchronously', () => {
        let newFile;
        let expectedFile;

        processCssSync('css/style.css', {
            newPath: testCwd,
            cwd: fixturesCwd
        });

        processSync('**/*.txt', {
            newPath: testCwd,
            cwd: fixturesCwd
        });

        newFile      = fs.readFileSync(testCwd + '/js/main.txt', 'utf8');
        expectedFile = fs.readFileSync(resultsCwd + '/js/main.txt', 'utf8');

        expect(newFile).to.equal(expectedFile);

        newFile      = fs.readFileSync(testCwd + '/css/style.css', 'utf8');
        expectedFile = fs.readFileSync(resultsCwd + '/css/style.css', 'utf8');

        expect(newFile).to.equal(expectedFile);
    });
});
