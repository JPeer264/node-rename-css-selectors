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
        rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
        rcs.nameGenerator.reset();
        rcs.selectorLibrary.reset();
        rcs.keyframesLibrary.reset();
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
            let newFile       = fs.readFileSync(testCwd + '/css/style.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/css/style-prefix.css', 'utf8');

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
            let newFile       = fs.readFileSync(testCwd + '/css/style.css', 'utf8');
            let newFile2      = fs.readFileSync(testCwd + '/css/style2.css', 'utf8');
            let newFile3      = fs.readFileSync(testCwd + '/css/subdirectory/style.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/css/style.css', 'utf8');
            let expectedFile2 = fs.readFileSync(resultsCwd + '/css/style2.css', 'utf8');
            let expectedFile3 = fs.readFileSync(resultsCwd + '/css/subdirectory/style.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);
            expect(newFile2).to.equal(expectedFile2);
            expect(newFile3).to.equal(expectedFile3);

            done();
        });
    });

    it('should process css files without options', done => {
        processCss(fixturesCwd + '/**/style*.css', (err, data) => {
            let newFile       = fs.readFileSync('./rcs/' + fixturesCwd + '/css/style.css', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/css/style.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);

            fs.removeSync('./rcs');

            done();
        });
    });

    it('should replace the selector attributes correctly', done => {
        processCss('css/css-attributes.css', {
            newPath: testCwd,
            cwd: fixturesCwd
        }, err => {
            expect(fs.readFileSync(testCwd + '/css/css-attributes.css', 'utf8')).to.equal(fs.readFileSync(resultsCwd + '/css/css-attributes.css', 'utf8'));

            done();
        });
    });

    it('should replace the selector attributes with pre and suffixes correctly', done => {
        processCss('css/css-attributes.css', {
            prefix: 'prefix-',
            suffix: '-suffix',
            newPath: testCwd,
            cwd: fixturesCwd
        }, err => {
            expect(fs.readFileSync(testCwd + '/css/css-attributes.css', 'utf8')).to.equal(fs.readFileSync(resultsCwd + '/css/css-attributes-pre-suffix.css', 'utf8'));

            done();
        });
    });

    it('should replace the selector attributes without caring about attribute selectors', done => {
        processCss('css/css-attributes.css', {
            prefix: 'prefix-',
            suffix: '-suffix',
            ignoreAttributeSelector: true,
            newPath: testCwd,
            cwd: fixturesCwd
        }, err => {
            expect(fs.readFileSync(testCwd + '/css/css-attributes.css', 'utf8')).to.equal(fs.readFileSync(resultsCwd + '/css/css-attributes-ignore.css', 'utf8'));

            done();
        });
    });
});
