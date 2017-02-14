'use strict';

const processCssSync = require('../processCssSync');

const fs     = require('fs-extra');
const rcs    = require('rcs-core');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('processCss/processCssSync', () => {
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

    it('should process css files synchornously', () => {
        processCssSync('**/style*.css', {
            newPath: testCwd,
            cwd: fixturesCwd
        });

        let newFile       = fs.readFileSync(testCwd + '/style.css', 'utf8');
        let newFile2      = fs.readFileSync(testCwd + '/style2.css', 'utf8');
        let newFile3      = fs.readFileSync(testCwd + '/subdirectory/style.css', 'utf8');
        let expectedFile  = fs.readFileSync(resultsCwd + '/style.css', 'utf8');
        let expectedFile2 = fs.readFileSync(resultsCwd + '/style2.css', 'utf8');
        let expectedFile3 = fs.readFileSync(resultsCwd + '/subdirectory/style.css', 'utf8');

        expect(newFile).to.equal(expectedFile);
        expect(newFile2).to.equal(expectedFile2);
        expect(newFile3).to.equal(expectedFile3);
    });

    it('should process css files as arrays synchornously', () => {
        processCssSync(['**/style.css', '**/style2.css'], {
            newPath: testCwd,
            cwd: fixturesCwd
        })

        let newFile       = fs.readFileSync(testCwd + '/style.css', 'utf8');
        let newFile2      = fs.readFileSync(testCwd + '/style2.css', 'utf8');
        let newFile3      = fs.readFileSync(testCwd + '/subdirectory/style.css', 'utf8');
        let expectedFile  = fs.readFileSync(resultsCwd + '/style.css', 'utf8');
        let expectedFile2 = fs.readFileSync(resultsCwd + '/style2.css', 'utf8');
        let expectedFile3 = fs.readFileSync(resultsCwd + '/subdirectory/style.css', 'utf8');

        expect(newFile).to.equal(expectedFile);
        expect(newFile2).to.equal(expectedFile2);
        expect(newFile3).to.equal(expectedFile3);
    });
});
