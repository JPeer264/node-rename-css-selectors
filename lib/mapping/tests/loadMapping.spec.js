'use strict';

const loadMapping = require('../loadMapping');
const generateMapping = require('../generateMapping');
const processCss = require('../../processCss/processCss');

const rcs    = require('rcs-core');
const fs     = require('fs-extra');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = process.cwd() + '/test/files/testCache';
const fixturesCwd = process.cwd() + '/test/files/fixtures';
const resultsCwd  = process.cwd() + '/test/files/results';

describe('mapping/loadMapping', () => {
    beforeEach(() => {
        rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
        rcs.nameGenerator.reset();
        rcs.selectorLibrary.reset();
        rcs.keyframesLibrary.reset();
    });

    afterEach(() => {
        fs.removeSync(testCwd);
    });

    it('should load from an object', () => {
        loadMapping({
            '.jp-block': 'a-class',
            '#compressed': 'b'
        });

        expect(rcs.selectorLibrary.get('jp-block')).to.equal('a-class');
        expect(rcs.selectorLibrary.get('#compressed')).to.equal('b');
    });
});
