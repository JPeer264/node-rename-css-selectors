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
        // reset counter and selectors for tests
        rcs.selectorLibrary.excludes            = [];
        rcs.selectorLibrary.selectors           = {};
        rcs.selectorLibrary.attributeSelectors  = {};
        rcs.selectorLibrary.compressedSelectors = {};

        rcs.nameGenerator.resetCountForTests();
    });

    afterEach(() => {
        fs.removeSync(testCwd);
    });

    it('should process all files synchronously', () => {
        let newFile;
        let expectedFile;

        processCssSync('style.css', {
            newPath: testCwd,
            cwd: fixturesCwd
        });

        processSync('**/*.txt', {
            newPath: testCwd,
            cwd: fixturesCwd
        });

        newFile      = fs.readFileSync(testCwd + '/main.txt', 'utf8');
        expectedFile = fs.readFileSync(resultsCwd + '/main.txt', 'utf8');

        expect(newFile).to.equal(expectedFile);

        newFile      = fs.readFileSync(testCwd + '/style.css', 'utf8');
        expectedFile = fs.readFileSync(resultsCwd + '/style.css', 'utf8');

        expect(newFile).to.equal(expectedFile);
    });
});
