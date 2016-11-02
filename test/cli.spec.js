'use strict';

const cli    = require('../lib/cli');
const rcs    = require('rcs-core');
const fs     = require('fs-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('cli.js', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.selectors           = {};
        rcs.selectorLibrary.compressedSelectors = {};
        rcs.selectorLibrary.excludes            = [];
        rcs.nameGenerator.resetCountForTests();
    });

    afterEach(() => {
        fs.removeSync(testCwd);
    });

    describe('processing', () => {
        it('should process css files', done => {
            cli.process('**/*.css', {
                collectSelectors: true,
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

        // duplicated code from the test before
        // but another function - especially for css
        it('should process css files with processCss', done => {
            cli.processCss('**/*.css', {
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


        it('should process css files and flatten the directories', done => {
            cli.process('**/*.css', {
                collectSelectors: true,
                flatten: true,
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                let newFile       = fs.readFileSync(testCwd + '/style.css', 'utf8');
                let newFile2      = fs.readFileSync(testCwd + '/style2.css', 'utf8');
                let expectedFile  = fs.readFileSync(resultsCwd + '/style.css', 'utf8');
                let expectedFile2 = fs.readFileSync(resultsCwd + '/style2.css', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.equal(expectedFile);
                expect(newFile2).to.equal(expectedFile2);

                done();
            });
        });

        it('should process js files', done => {
            rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                cli.process('**/*.txt', {
                    newPath: testCwd,
                    cwd: fixturesCwd
                }, (err, data) => {
                    let newFile      = fs.readFileSync(testCwd + '/main.txt', 'utf8');
                    let expectedFile = fs.readFileSync(resultsCwd + '/main.txt', 'utf8');

                    expect(err).to.not.exist;
                    expect(newFile).to.equal(expectedFile);

                    done();
                });
            });
        });

        it('should process html files', done => {
            rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                cli.process('**/*.html', {
                    newPath: testCwd,
                    cwd: fixturesCwd
                }, (err, data) => {
                    let newFile      = fs.readFileSync(testCwd + '/index.html', 'utf8');
                    let expectedFile = fs.readFileSync(resultsCwd + '/index.html', 'utf8');

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

    describe('generating files', () => {
        beforeEach(done => {
            cli.processCss('**/*.css', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                done();
            });
        });

        it('should create the normal library file', done => {
            cli.generateLibraryFile(testCwd, (err, data) => {
                const cssMapping = fs.readFileSync(testCwd + '/renaming_map.js', 'utf8');

                expect(err).to.not.exist;

                // TODO read variable and check values
                // expect(cssMapping['jp-block']).to.equal('a');

                done();

            });
        });

        it('should create the minified library file', done => {
            cli.generateLibraryFile(testCwd, {
                cssMapping: false,
                cssMappingMin: true
            }, (err, data) => {
                const cssMapping = fs.readFileSync(testCwd + '/renaming_map_min.js', 'utf8');

                expect(err).to.not.exist;

                // TODO read variable and check values
                // expect(cssMapping['jp-block']).to.equal('a');

                done();

            });
        });

        it('should create the extended normal library file', done => {
            cli.generateLibraryFile(testCwd, {
                extended: true
            }, (err, data) => {
                const cssMapping = fs.readFileSync(testCwd + '/renaming_map.js', 'utf8');

                expect(err).to.not.exist;

                // TODO read variable and check values
                // expect(cssMapping['jp-block']).to.equal('a');

                done();

            });
        });

        it('should create the minified library file', done => {
            cli.generateLibraryFile(testCwd, {
                cssMapping: false,
                cssMappingMin: true,
                extended: true
            }, (err, data) => {
                const cssMapping = fs.readFileSync(testCwd + '/renaming_map_min.js', 'utf8');

                expect(err).to.not.exist;

                // TODO read variable and check values
                // expect(cssMapping['jp-block']).to.equal('a');

                done();

            });
        });

        it('should create the both library files', done => {
            cli.generateLibraryFile(testCwd, {
                cssMapping: true,
                cssMappingMin: true
            }, (err, data) => {
                const cssMapping    = fs.readFileSync(testCwd + '/renaming_map.js', 'utf8');
                const cssMappingMin = fs.readFileSync(testCwd + '/renaming_map_min.js', 'utf8');

                expect(err).to.not.exist;

                // TODO read variable and check values
                // expect(cssMapping['jp-block']).to.equal('a');

                done();

            });
        });

        it('should create the both extended library files', done => {
            cli.generateLibraryFile(testCwd, {
                extended: true,
                cssMapping: true,
                cssMappingMin: true
            }, (err, data) => {
                const cssMapping    = fs.readFileSync(testCwd + '/renaming_map.js', 'utf8');
                const cssMappingMin = fs.readFileSync(testCwd + '/renaming_map_min.js', 'utf8');

                expect(err).to.not.exist;

                // TODO read variable and check values
                // expect(cssMapping['jp-block']).to.equal('a');

                done();

            });
        });
    });

    describe('include config', () => {
        it('should set the config with package.json', done => {
            // include config
            cli.includeConfig();

            // include new settings
            rcs.selectorLibrary.set(['js', 'any-value']);

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
            cli.includeConfig();

            // include new settings
            rcs.selectorLibrary.set(['flexbox', 'any-value']);

            expect(rcs.selectorLibrary.get('flexbox')).to.equal('flexbox');
            expect(rcs.selectorLibrary.get('any-value')).to.equal('a');

            fs.removeSync(file);

            done();
        });

        it('should set the config with package.json', done => {
            // include config
            cli.includeConfig('test/files/config.json');

            // include new settings
            rcs.selectorLibrary.set(['own-file', 'any-value']);

            expect(rcs.selectorLibrary.get('own-file')).to.equal('own-file');
            expect(rcs.selectorLibrary.get('any-value')).to.equal('a');

            done();
        });
    });
});
