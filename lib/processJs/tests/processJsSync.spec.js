'use strict';

const processJsSync = require('../processJsSync');

const fs     = require('fs-extra');
const rcs    = require('rcs-core');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('processJsSync/processJsSync', () => {
    before(() => {
        rcs.nameGenerator.resetCountForTests();
        rcs.selectorLibrary.fillLibrary(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8'))
    });

    afterEach(() => {
        fs.removeSync(testCwd);
    });

    it('should process js files', () => {
        processJsSync('js/main.txt', {
            newPath: testCwd,
            cwd: fixturesCwd
        });

        let newFile       = fs.readFileSync(testCwd + '/js/main.txt', 'utf8');
        let expectedFile  = fs.readFileSync(resultsCwd + '/js/main.txt', 'utf8');

        expect(newFile).to.equal(expectedFile);
    });

    it('should process jsx files', () => {
        processJsSync('js/react.txt', {
            newPath: testCwd,
            cwd: fixturesCwd,
            jsx: true,
        });

        let newFile       = fs.readFileSync(testCwd + '/js/react.txt', 'utf8');
        let expectedFile  = fs.readFileSync(resultsCwd + '/js/react.txt', 'utf8');

        expect(newFile).to.equal(expectedFile);
    });

    it('should not process jsx files', () => {
        processJsSync('js/react.txt', {
            newPath: testCwd,
            cwd: fixturesCwd,
        });

        let newFile       = fs.readFileSync(testCwd + '/js/react.txt', 'utf8');
        let expectedFile  = fs.readFileSync(testCwd + '/js/react.txt', 'utf8');

        expect(newFile).to.equal(expectedFile);
    });

    it('should process complex files', () => {
        processJsSync('js/complex.txt', {
            newPath: testCwd,
            cwd: fixturesCwd,
        });

        let newFile       = fs.readFileSync(testCwd + '/js/complex.txt', 'utf8');
        let expectedFile  = fs.readFileSync(testCwd + '/js/complex.txt', 'utf8');

        expect(newFile).to.equal(expectedFile);
    });

    it('should not process multiple files', () => {
        processJsSync('js/*.txt', {
            newPath: testCwd,
            cwd: fixturesCwd,
            jsx: true,
        });

        let newFile      = fs.readFileSync(testCwd + '/js/complex.txt', 'utf8');
        let newFileTwo   = fs.readFileSync(testCwd + '/js/main.txt', 'utf8');
        let newFileThree = fs.readFileSync(testCwd + '/js/react.txt', 'utf8');
        let expectedFile = fs.readFileSync(resultsCwd + '/js/complex.txt', 'utf8');
        let expectedFileTwo = fs.readFileSync(resultsCwd + '/js/main.txt', 'utf8');
        let expectedFileThree = fs.readFileSync(resultsCwd + '/js/react.txt', 'utf8');

        expect(newFile).to.equal(expectedFile);
        expect(newFileTwo).to.equal(expectedFileTwo);
        expect(newFileThree).to.equal(expectedFileThree);
    });
});
