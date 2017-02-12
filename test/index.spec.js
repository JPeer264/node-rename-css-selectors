'use strict';

const app    = require('../');
const rcs    = require('rcs-core');
const fs     = require('fs-extra');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd     = 'test/files/testCache';
const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('app.js', () => {
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
        it('should process css files', done => {
            app.process('**/style*.css', {
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

        it('should process css files as arrays', done => {
            app.process(['**/style.css', '**/style2.css'], {
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
        it('should process css files and prefix them', done => {
            app.processCss('**/style*.css', {
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
            app.processCss('**/style*.css', {
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
            app.processCss(fixturesCwd + '/**/style*.css', (err, data) => {
                let newFile       = fs.readFileSync('./rcs/' + fixturesCwd + '/style.css', 'utf8');
                let expectedFile  = fs.readFileSync(resultsCwd + '/style.css', 'utf8');

                expect(err).to.not.exist;
                expect(newFile).to.equal(expectedFile);

                fs.removeSync('./rcs');

                done();
            });
        });

        it('should replace the selector attributes correctly', done => {
            app.processCss('css-attributes.css', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, err => {
                expect(fs.readFileSync(testCwd + '/css-attributes.css', 'utf8')).to.equal(fs.readFileSync(resultsCwd + '/css-attributes.css', 'utf8'));

                done();
            });
        });

        it('should replace the selector attributes with pre and suffixes correctly', done => {
            app.processCss('css-attributes.css', {
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
            app.processCss('css-attributes.css', {
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

        it('should process css files and flatten the directories', done => {
            app.process('**/style*.css', {
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
                app.process('**/*.txt', {
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
                app.process('**/*.html', {
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

        it('should not overwrite original files', done => {
            app.process(['**/style.css', '**/style2.css'], {
                collectSelectors: true,
                newPath: fixturesCwd,
                cwd: fixturesCwd
            }, err => {
                expect(err.message).to.equal('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');

                done();
            });
        });

        it('should fail', done => {
            app.process('path/**/with/nothing/in/it', err => {
                expect(err).to.be.an('object');
                expect(err.error).to.equal('ENOENT');

                done();
            });
        });
    });

    describe('generating files', () => {
        beforeEach(done => {
            app.processCss('**/style*.css', {
                newPath: testCwd,
                cwd: fixturesCwd
            }, (err, data) => {
                done();
            });
        });

        it('should create the normal mapping file', done => {
            app.generateMapping(testCwd, (err, data) => {
                const cssMapping = json.readToObjSync(testCwd + '/renaming_map.json', 'utf8');

                expect(err).to.not.exist;
                expect(cssMapping['.jp-block']).to.equal('a');
                expect(cssMapping['.jp-block__element']).to.equal('b');

                done();

            });
        });

        it('should create the minified mapping file', done => {
            app.generateMapping(testCwd, {
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
            app.generateMapping(testCwd, {
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
            app.generateMapping(testCwd, {
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

        it('should create the custom names minified mapping file', done => {
            app.generateMapping(testCwd, {
                cssMapping: 'custom-name'
            }, (err, data) => {
                const cssMapping = json.readToObjSync(testCwd + '/custom-name.json', 'utf8');

                expect(err).to.not.exist;
                expect(cssMapping['.jp-block']).to.equal('a');
                expect(cssMapping['.jp-block__element']).to.equal('b');

                done();

            });
        });

        it('should create the minified mapping file', done => {
            app.generateMapping(testCwd, {
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
            app.generateMapping(testCwd, {
                json: false
            }, (err, data) => {
                const cssMapping = fs.readFileSync(testCwd + '/renaming_map.js', 'utf8');

                expect(err).to.not.exist;
                expect(cssMapping).to.match(/var CSS_NAME_MAPPING = {/);

                done();

            });
        });


        it('should overwrite mapping files', done => {
            app.generateMapping(testCwd, (err, data) => {
                app.generateMapping(testCwd, { overwrite: true }, (err2, data) => {
                    expect(err).to.not.exist;
                    expect(err2).to.not.exist;

                    done();
                });
            });
        });

        it('should not overwrite mapping files', done => {
            app.generateMapping(testCwd, (err, data) => {
                app.generateMapping(testCwd, (err2, data) => {
                    expect(err).to.not.exist;
                    expect(err2).to.exist;
                    expect(err2.message).to.equal('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');

                    done();
                });
            });
        });
    });

    describe('load mapping', () => {
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
                let newFile      = fs.readFileSync(testCwd + '/index.html', 'utf8');
                let expectedFile = fs.readFileSync(resultsCwd + '/index.html', 'utf8');

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
                let newFile      = fs.readFileSync(testCwd + '/index.html', 'utf8');
                let expectedFile = fs.readFileSync(resultsCwd + '/index.html', 'utf8');

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
                let newFile      = fs.readFileSync(testCwd + '/index.html', 'utf8');
                let expectedFile = fs.readFileSync(resultsCwd + '/index.html', 'utf8');

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
                        let newFile      = fs.readFileSync(testCwd + '/index.html', 'utf8');
                        let expectedFile = fs.readFileSync(resultsCwd + '/index.html', 'utf8');

                        expect(err).to.not.exist;
                        expect(newFile).to.equal(expectedFile);

                        done();
                    });
                });
                });
            });

    });

    describe('include config', () => {
        it('should set the config with package.json', done => {
            // include config
            app.includeConfig();

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
            app.includeConfig();

            // include new settings
            rcs.selectorLibrary.set(['flexbox', 'any-value']);

            expect(rcs.selectorLibrary.get('flexbox')).to.equal('flexbox');
            expect(rcs.selectorLibrary.get('any-value')).to.equal('a');

            fs.removeSync(file);

            done();
        });

        it('should set the config with package.json', done => {
            // include config
            app.includeConfig('test/files/config.json');

            // include new settings
            rcs.selectorLibrary.set(['own-file', 'any-value']);

            expect(rcs.selectorLibrary.get('own-file')).to.equal('own-file');
            expect(rcs.selectorLibrary.get('any-value')).to.equal('a');

            done();
        });
    });
});
