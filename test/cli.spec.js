'use strict';

const cli    = require('../lib/cli');
const rcs    = require('../lib/utils/rcs');
const fs     = require('fs');
const expect = require('chai').expect;

describe('cli.js', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.selectors = {};
        rcs.nameGenerator.resetCountForTests();
    });

    it('should process css files', done => {
        cli.process('**/*.css', {
            collectSelectors: true,
            newPath: 'test/files/testCache',
            cwd: 'test/files/fixtures'
        }, (err, data) => {
            let newFile       = fs.readFileSync('test/files/testCache/style.css', 'utf8');
            let newFile2      = fs.readFileSync('test/files/testCache/style2.css', 'utf8');
            let newFile3      = fs.readFileSync('test/files/testCache/subdirectory/style.css', 'utf8');
            let expectedFile  = fs.readFileSync('test/files/results/style.css', 'utf8');
            let expectedFile2 = fs.readFileSync('test/files/results/style2.css', 'utf8');
            let expectedFile3 = fs.readFileSync('test/files/results/subdirectory/style.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);
            expect(newFile2).to.equal(expectedFile2);
            expect(newFile3).to.equal(expectedFile3);

            done();
        });
    });

    it('should process css files and flatten the directories', done => {
        cli.process('**/*.css', {
            collectSelectors: true,
            flatten: true,
            newPath: 'test/files/testCache',
            cwd: 'test/files/fixtures'
        }, (err, data) => {
            let newFile       = fs.readFileSync('test/files/testCache/style.css', 'utf8');
            let newFile2      = fs.readFileSync('test/files/testCache/style2.css', 'utf8');
            let expectedFile  = fs.readFileSync('test/files/results/style.css', 'utf8');
            let expectedFile2 = fs.readFileSync('test/files/results/style2.css', 'utf8');

            expect(err).to.not.exist;
            expect(newFile).to.equal(expectedFile);
            expect(newFile2).to.equal(expectedFile2);

            done();
        });
    });

    it('should process js files', done => {
        rcs.fileReplace.replaceCss('test/files/fixtures/style.css', (err, data) => {
            cli.process('**/*.txt', {
                newPath: 'test/files/testCache',
                cwd: 'test/files/fixtures'
            }, (err, data) => {
                let newFile      = fs.readFileSync('test/files/testCache/main.txt', 'utf8');
                let expectedFile = fs.readFileSync('test/files/results/main.txt', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.equal(expectedFile);

                done();
            });
        });
    });

    it('should process html files', done => {
        rcs.fileReplace.replaceCss('test/files/fixtures/style.css', (err, data) => {
            cli.process('**/*.html', {
                newPath: 'test/files/testCache',
                cwd: 'test/files/fixtures'
            }, (err, data) => {
                let newFile      = fs.readFileSync('test/files/testCache/index.html', 'utf8');
                let expectedFile = fs.readFileSync('test/files/results/index.html', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.equal(expectedFile);

                done();
            });
        });
    });

    it('should fail', done => {
        cli.process('path/**/with/nothing/in/it', err => {
            expect(err).to.be.an('object');
            expect(err.error).to.equal('ENOENT');

            done();
        });
    });
});
