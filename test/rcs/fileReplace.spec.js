'use strict';

const rcs    = require('../../lib/utils/rcs');
const fs     = require('fs');
const expect = require('chai').expect;

const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('rcs file replace', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.selectors = {};
        rcs.nameGenerator.resetCountForTests();
    });

    describe('replaceCss', () => {
        it('should return the modified css file', done => {
            rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/style.css', 'utf8'));

                done();
            });
        });

        it('should modify the second one with the values from the first', done => {
            rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                rcs.replace.fileCss(fixturesCwd + '/style2.css', (err, data) => {
                    expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/style2.css', 'utf8'));

                    done();
                });
            });
        });

        it('should fail', done => {
            rcs.replace.fileCss('non/exisiting/path.css', (err, data) => {
                expect(err).to.be.an('object');
                expect(err.error).to.equal('ENOENT');

                done();
            });
        });
    });

    describe('replace any file', () => {
        it('should fail', done => {
            rcs.replace.file('non/exisiting/path.css', (err, data) => {
                expect(err).to.be.an('object');
                expect(err.error).to.equal('ENOENT');

                done();
            });
        });

        it('should return the modified html file', done => {
            rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                rcs.replace.file(fixturesCwd + '/index.html', (err, data) => {
                    expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/index.html', 'utf8'));

                    done();
                });
            });
        });

        it('should return the modified js file', done => {
            // `js` file imported as `txt` to avoid having mocha-phantomjs
            rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                rcs.replace.file(fixturesCwd + '/main.txt', (err, data) => {
                    expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/main.txt', 'utf8'));

                    done();
                });
            });
        });
    });
});
