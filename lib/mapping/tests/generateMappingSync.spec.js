'use strict';

const generateMappingSync = require('../generateMappingSync');
const processCss = require('../../processCss/processCss');

const rcs    = require('rcs-core');
const fs     = require('fs-extra');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = process.cwd() + '/test/files/testCache';
const fixturesCwd = process.cwd() + '/test/files/fixtures';
const resultsCwd  = process.cwd() + '/test/files/results';

describe('mapping/generateMappingSync', () => {
    beforeEach(done => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.excludes            = [];
        rcs.selectorLibrary.selectors           = {};
        rcs.selectorLibrary.attributeSelectors  = {};
        rcs.selectorLibrary.compressedSelectors = {};

        rcs.nameGenerator.resetCountForTests();

        processCss('**/style*.css', {
            newPath: testCwd,
            cwd: fixturesCwd
        }, (err, data) => {
            done();
        });
    });

    afterEach(() => {
        fs.removeSync(testCwd);
    });

    it('should create the normal mapping file synchornously', () => {
        generateMappingSync(testCwd);

        const cssMapping = json.readToObjSync(testCwd + '/renaming_map.json', 'utf8');

        expect(cssMapping['.jp-block']).to.equal('a');
        expect(cssMapping['.jp-block__element']).to.equal('b');
    });
});
