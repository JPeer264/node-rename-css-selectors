'use strict';

const app    = require('../');

const fs     = require('fs-extra');
const rcs    = require('rcs-core');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('integration tests', () => {
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

    describe('processing', () => {
        it('should process js files', done => {
            rcs.selectorLibrary.fillLibrary(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8'));

            app.process('**/*.txt', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                let newFile      = fs.readFileSync(testCwd + '/js/main.txt', 'utf8');
                let expectedFile = fs.readFileSync(resultsCwd + '/js/main.txt', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.equal(expectedFile);

                done();
            });
        });

        it('should process html files', done => {
            rcs.selectorLibrary.fillLibrary(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8'));

            app.process('**/*.html', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                let newFile      = fs.readFileSync(testCwd + '/html/index.html', 'utf8');
                let expectedFile = fs.readFileSync(resultsCwd + '/html/index.html', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.equal(expectedFile);

                done();
            });
        });
    });

    describe('w/ mapping', () => {
        beforeEach(done => {
            app.processCss('**/style*.css', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                app.generateMapping(testCwd, (err, data) => {
                    rcs.selectorLibrary.selectors           = {};
                    rcs.selectorLibrary.compressedSelectors = {};
                    rcs.selectorLibrary.excludes            = [];
                    rcs.nameGenerator.resetCountForTests();

                    done();
                });
            });
        });

        it('should load from an object', done => {
            const cssMapping = json.readToObjSync(testCwd + '/renaming_map.json', 'utf8');

            app.loadMapping(cssMapping);

            app.process('**/*.html', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                let newFile      = fs.readFileSync(testCwd + '/html/index.html', 'utf8');
                let expectedFile = fs.readFileSync(resultsCwd + '/html/index.html', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.equal(expectedFile);

                done();
            });
        });

        it('should load from a filestring', done => {
            app.loadMapping(testCwd + '/renaming_map.json');

            app.process('**/*.html', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                let newFile      = fs.readFileSync(testCwd + '/html/index.html', 'utf8');
                let expectedFile = fs.readFileSync(resultsCwd + '/html/index.html', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.equal(expectedFile);

                done();
            });
        });

        it('should load nothing as it does not exist', done => {
            app.loadMapping(testCwd + '/doesnotexist.json');

            app.process('**/*.html', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                let newFile      = fs.readFileSync(testCwd + '/html/index.html', 'utf8');
                let expectedFile = fs.readFileSync(resultsCwd + '/html/index.html', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.not.equal(expectedFile);

                done();
            });
        });

        it('should load from a filestring', done => {
            app.processCss('**/style*.css', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                app.generateMapping(testCwd, { cssMappingMin: true }, (err, data) => {
                    rcs.selectorLibrary.selectors           = {};
                    rcs.selectorLibrary.compressedSelectors = {};
                    rcs.selectorLibrary.excludes            = [];
                    rcs.nameGenerator.resetCountForTests();

                    app.loadMapping(testCwd + '/renaming_map_min.json', { origValues: false });

                    app.process('**/*.html', {
                        newPath: testCwd,
                        cwd: fixturesCwd
                    }, (err, data) => {
                        let newFile      = fs.readFileSync(testCwd + '/html/index.html', 'utf8');
                        let expectedFile = fs.readFileSync(resultsCwd + '/html/index.html', 'utf8');

                        expect(err).to.not.exist;
                        expect(newFile).to.equal(expectedFile);

                        done();
                    });
                });
            });
        });
    });
});
