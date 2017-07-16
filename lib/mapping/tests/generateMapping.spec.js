'use strict';

const generateMapping = require('../generateMapping');
const processCss = require('../../processCss/processCss');

const rcs    = require('rcs-core');
const fs     = require('fs-extra');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = process.cwd() + '/test/files/testCache';
const fixturesCwd = process.cwd() + '/test/files/fixtures';
const resultsCwd  = process.cwd() + '/test/files/results';

describe('mapping/generateMapping', () => {
    beforeEach(done => {
        rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
        rcs.nameGenerator.reset();
        rcs.selectorLibrary.reset();
        rcs.keyframesLibrary.reset();

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

    it('should create the normal mapping file', done => {
        generateMapping(testCwd, (err, data) => {
            const cssMapping = json.readToObjSync(testCwd + '/renaming_map.json', 'utf8');

            expect(err).to.not.exist;
            expect(cssMapping['.jp-block']).to.equal('a');
            expect(cssMapping['.jp-block__element']).to.equal('b');

            done();
        });
    });

    it('should create the minified mapping file', done => {
        generateMapping(testCwd, {
            cssMapping: false,
            cssMappingMin: true
        }, (err, data) => {
            const cssMappingMin = json.readToObjSync(testCwd + '/renaming_map_min.json', 'utf8');

            expect(err).to.not.exist;
            expect(cssMappingMin['.a']).to.equal('jp-block');
            expect(cssMappingMin['.b']).to.equal('jp-block__element');

            done();

        });
    });

    it('should create the extended normal mapping file', done => {
        generateMapping(testCwd, {
            extended: true
        }, (err, data) => {
            const cssMapping = json.readToObjSync(testCwd + '/renaming_map.json', 'utf8');

            expect(err).to.not.exist;
            expect(cssMapping['.jp-block']).to.be.an('object');
            expect(cssMapping['.jp-block']).to.have.any.keys('type', 'typeChar');
            expect(cssMapping['.jp-block']['type']).to.equal('class');

            done();

        });
    });

    it('should create the minified mapping file', done => {
        generateMapping(testCwd, {
            cssMapping: false,
            cssMappingMin: true,
            extended: true
        }, (err, data) => {
            const cssMappingMin = json.readToObjSync(testCwd + '/renaming_map_min.json', 'utf8');

            expect(err).to.not.exist;
            expect(cssMappingMin['.a']).to.be.an('object');
            expect(cssMappingMin['.a']).to.have.any.keys('type', 'typeChar');
            expect(cssMappingMin['.a']['type']).to.equal('class');

            done();

        });
    });

    it('should create the minified mapping file with a custom name', done => {
        generateMapping(testCwd, {
            cssMappingMin: 'custom-name'
        }, (err, data) => {
            const cssMappingMin = json.readToObjSync(testCwd + '/custom-name.json', 'utf8');

            expect(err).to.not.exist;
            expect(cssMappingMin['.a']).to.equal('jp-block');
            expect(cssMappingMin['.b']).to.equal('jp-block__element');

            done();

        });
    });

    it('should create the minified mapping js file', done => {
        generateMapping(testCwd, {
            json: false
        }, (err, data) => {
            const cssMapping = fs.readFileSync(testCwd + '/renaming_map.js', 'utf8');

            expect(err).to.not.exist;
            expect(cssMapping).to.match(/var CSS_NAME_MAPPING = {/);

            done();

        });
    });

    it('should overwrite mapping files', done => {
        generateMapping(testCwd, (err, data) => {
            generateMapping(testCwd, { overwrite: true }, (err2, data) => {
                expect(err).to.not.exist;
                expect(err2).to.not.exist;

                done();
            });
        });
    });

    it('should not overwrite mapping files', done => {
        generateMapping(testCwd, (err, data) => {
            generateMapping(testCwd, (err2, data) => {
                expect(err).to.not.exist;
                expect(err2).to.exist;
                expect(err2.message).to.equal('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');

                done();
            });
        });
    });

    it('should create the custom names minified mapping file', done => {
        generateMapping(testCwd, {
            cssMapping: 'custom-name'
        }, (err, data) => {
            const cssMapping = json.readToObjSync(testCwd + '/custom-name.json', 'utf8');

            expect(err).to.not.exist;
            expect(cssMapping['.jp-block']).to.equal('a');
            expect(cssMapping['.jp-block__element']).to.equal('b');

            done();

        });
    });
});
