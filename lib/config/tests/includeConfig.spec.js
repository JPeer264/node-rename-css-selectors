'use strict';

const includeConfig = require('../includeConfig');

const fs  = require('fs-extra');
const rcs = require('rcs-core');
const expect = require('chai').expect;

const testFiles   = process.cwd() + '/test/files';

describe('config/includeConfig', () => {
    beforeEach(() => {
        rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
        rcs.nameGenerator.reset();
        rcs.selectorLibrary.reset();
        rcs.keyframesLibrary.reset();
    });

    it('should set the config with package.json', done => {
        // include config
        includeConfig();

        // include new settings
        rcs.selectorLibrary.set(['.js', '.any-value']);

        expect(rcs.selectorLibrary.get('js')).to.equal('js');
        expect(rcs.selectorLibrary.get('any-value')).to.equal('a');

        done();
    });

    it('should set the config with .rcsrc', done => {
        const file = '.rcsrc';

        fs.writeFileSync(file, `{
            "exclude": [
                "flexbox",
                "no-js"
            ]
        }`, {
            encoding: 'utf8'
        });

        // include config
        includeConfig();

        // include new settings
        rcs.selectorLibrary.set(['.flexbox', '.any-value']);

        expect(rcs.selectorLibrary.get('flexbox')).to.equal('flexbox');
        expect(rcs.selectorLibrary.get('any-value')).to.equal('a');

        fs.removeSync(file);

        done();
    });

    it('should set the config with package.json', done => {
        // include config
        includeConfig(testFiles + '/config.json');

        // include new settings
        rcs.selectorLibrary.set(['.own-file', '.any-value']);

        expect(rcs.selectorLibrary.get('own-file')).to.equal('own-file');
        expect(rcs.selectorLibrary.get('any-value')).to.equal('a');

        done();
    });
});
