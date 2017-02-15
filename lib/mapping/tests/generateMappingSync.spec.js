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

    it('should create the normal mapping file synchronously', () => {
        generateMappingSync(testCwd);

        const cssMapping = json.readToObjSync(testCwd + '/renaming_map.json', 'utf8');

        expect(cssMapping['.jp-block']).to.equal('a');
        expect(cssMapping['.jp-block__element']).to.equal('b');
    });

    it('should create the minified mapping file synchronously', () => {
        generateMappingSync(testCwd, {
            cssMapping: false,
            cssMappingMin: true
        });

        const cssMappingMin = json.readToObjSync(testCwd + '/renaming_map_min.json', 'utf8');

        expect(cssMappingMin['.a']).to.equal('jp-block');
        expect(cssMappingMin['.b']).to.equal('jp-block__element');
    });

    it('should create the custom names minified mapping file synchronously', () => {
        generateMappingSync(testCwd, {
            cssMapping: 'custom-name'
        });

        const cssMapping = json.readToObjSync(testCwd + '/custom-name.json', 'utf8');

        expect(cssMapping['.jp-block']).to.equal('a');
        expect(cssMapping['.jp-block__element']).to.equal('b');
    });

    it('should create the minified mapping file with a custom name synchronously', () => {
        generateMappingSync(testCwd, {
            cssMappingMin: 'custom-name'
        });

        const cssMappingMin = json.readToObjSync(testCwd + '/custom-name.json', 'utf8');

        expect(cssMappingMin['.a']).to.equal('jp-block');
        expect(cssMappingMin['.b']).to.equal('jp-block__element');
    });

    it('should create the minified mapping js file synchronously', () => {
        generateMappingSync(testCwd, {
            json: false
        });

        const cssMapping = fs.readFileSync(testCwd + '/renaming_map.js', 'utf8');

        expect(cssMapping).to.match(/var CSS_NAME_MAPPING = {/);
    });
});
