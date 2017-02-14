'use strict';

const processCss = require('../processCss');

const fs     = require('fs-extra');
const rcs    = require('rcs-core');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('processCss/processCss', () => {
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

    it('should process css files and prefix them', done => {
        processCss('**/style*.css', {
            newPath: testCwd,
            cwd: fixturesCwd,
            prefix: 'prefixed-'
        }, (err, data) => {
            let newFile       = fs.readFileSync(testCwd + '/style.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/style-prefix.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);

            done();
        });
    });

    it('should process css files with processCss', done => {
        processCss('**/style*.css', {
            newPath: testCwd,
            cwd: fixturesCwd
        }, (err, data) => {
            let newFile       = fs.readFileSync(testCwd + '/style.css', 'utf8');
            let newFile2      = fs.readFileSync(testCwd + '/style2.css', 'utf8');
            let newFile3      = fs.readFileSync(testCwd + '/subdirectory/style.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/style.css', 'utf8');
            let expectedFile2 = fs.readFileSync(resultsCwd + '/style2.css', 'utf8');
            let expectedFile3 = fs.readFileSync(resultsCwd + '/subdirectory/style.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);
            expect(newFile2).to.equal(expectedFile2);
            expect(newFile3).to.equal(expectedFile3);

            done();
        });
    });

    it('should process css files without options', done => {
        processCss(fixturesCwd + '/**/style*.css', (err, data) => {
            let newFile       = fs.readFileSync('./rcs/' + fixturesCwd + '/style.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/style.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);

            fs.removeSync('./rcs');

            done();
        });
    });

    it('should replace the selector attributes correctly', done => {
        processCss('css-attributes.css', {
            newPath: testCwd,
            cwd: fixturesCwd
        }, err => {
            expect(fs.readFileSync(testCwd + '/css-attributes.css', 'utf8')).to.equal(fs.readFileSync(resultsCwd + '/css-attributes.css', 'utf8'));

            done();
        });
    });

    it('should replace the selector attributes with pre and suffixes correctly', done => {
        processCss('css-attributes.css', {
            prefix: 'prefix-',
            suffix: '-suffix',
            newPath: testCwd,
            cwd: fixturesCwd
        }, err => {
            expect(fs.readFileSync(testCwd + '/css-attributes.css', 'utf8')).to.equal(fs.readFileSync(resultsCwd + '/css-attributes-pre-suffix.css', 'utf8'));

            done();
        });
    });

    it('should replace the selector attributes without caring about attribute selectors', done => {
        processCss('css-attributes.css', {
            prefix: 'prefix-',
            suffix: '-suffix',
            ignoreAttributeSelector: true,
            newPath: testCwd,
            cwd: fixturesCwd
        }, err => {
            expect(fs.readFileSync(testCwd + '/css-attributes.css', 'utf8')).to.equal(fs.readFileSync(resultsCwd + '/css-attributes-ignore.css', 'utf8'));

            done();
        });
    });
});
