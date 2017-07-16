'use strict';

const processJs = require('../processJs');

const fs     = require('fs-extra');
const rcs    = require('rcs-core');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('processJs/processJs', () => {
    before(() => {
        rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
        rcs.nameGenerator.reset();
        rcs.selectorLibrary.reset();
        rcs.keyframesLibrary.reset();

        rcs.selectorLibrary.fillLibrary(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8'))
    });

    afterEach(() => {
        fs.removeSync(testCwd);
    });

    it('should process js files', done => {
        processJs('js/main.txt', {
            newPath: testCwd,
            cwd: fixturesCwd
        }, err => {
            let newFile       = fs.readFileSync(testCwd + '/js/main.txt', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/js/main.txt', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);

            done();
        });
    });

    it('should process jsx files', done => {
        processJs('js/react.txt', {
            newPath: testCwd,
            cwd: fixturesCwd,
            jsx: true,
        }, err => {
            let newFile       = fs.readFileSync(testCwd + '/js/react.txt', 'utf8');
            let expectedFile  = fs.readFileSync(resultsCwd + '/js/react.txt', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);

            done();
        });
    });

    it('should not process jsx files', done => {
        processJs('js/react.txt', {
            newPath: testCwd,
            cwd: fixturesCwd,
        }, err => {
            let newFile       = fs.readFileSync(testCwd + '/js/react.txt', 'utf8');
            let expectedFile  = fs.readFileSync(testCwd + '/js/react.txt', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);

            done();
        });
    });

    it('should process complex files', done => {
        processJs('js/complex.txt', {
            newPath: testCwd,
            cwd: fixturesCwd,
        }, err => {
            let newFile       = fs.readFileSync(testCwd + '/js/complex.txt', 'utf8');
            let expectedFile  = fs.readFileSync(testCwd + '/js/complex.txt', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);

            done();
        });
    });

    it('should not process multiple files', done => {
        processJs('js/*.txt', {
            newPath: testCwd,
            cwd: fixturesCwd,
            jsx: true,
        }, err => {
            let newFile      = fs.readFileSync(testCwd + '/js/complex.txt', 'utf8');
            let newFileTwo   = fs.readFileSync(testCwd + '/js/main.txt', 'utf8');
            let newFileThree = fs.readFileSync(testCwd + '/js/react.txt', 'utf8');
            let expectedFile = fs.readFileSync(resultsCwd + '/js/complex.txt', 'utf8');
            let expectedFileTwo = fs.readFileSync(resultsCwd + '/js/main.txt', 'utf8');
            let expectedFileThree = fs.readFileSync(resultsCwd + '/js/react.txt', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);
            expect(newFileTwo).to.equal(expectedFileTwo);
            expect(newFileThree).to.equal(expectedFileThree);

            done();
        });
    });
});
