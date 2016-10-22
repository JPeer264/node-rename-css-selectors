'use strict';

const rcs    = require('../../lib/utils/rcs');
const fs     = require('fs');
const expect = require('chai').expect;

describe('rcs file replace', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.selectors = {};
        rcs.nameGenerator.resetCountForTests();
    });

    describe('replaceCss', () => {
        it('should return the modified css file', done => {
            rcs.fileReplace.replaceCss('test/files/fixtures/style.css', (err, data) => {
                expect(data).to.equal(fs.readFileSync('test/files/results/style.css', 'utf8'));

                done();
            });
        });

        it('should fail', done => {
            rcs.fileReplace.replaceCss('non/exisiting/path.css', err => {
                expect(err).to.be.an('object');
                expect(err.error).to.equal('ENOENT');

                done();
            });
        });
    });

    describe('replace any file', () => {
        it('should fail', done => {
            rcs.fileReplace.replace('non/exisiting/path.css', err => {
                expect(err).to.be.an('object');
                expect(err.error).to.equal('ENOENT');

                done();
            });
        });

        it('should return the modified html file', done => {
            rcs.fileReplace.replaceCss('test/files/fixtures/style.css', (err, data) => {
                rcs.fileReplace.replace('test/files/fixtures/index.html', (err, data) => {
                    expect(data).to.equal(fs.readFileSync('test/files/results/index.html', 'utf8'));

                    done();
                });
            });
        });

        it('should return the modified js file', done => {
            // `js` file imported as `txt` to avoid having mocha-phantomjs
            rcs.fileReplace.replaceCss('test/files/fixtures/style.css', (err, data) => {
                rcs.fileReplace.replace('test/files/fixtures/main.txt', (err, data) => {
                    expect(data).to.equal(fs.readFileSync('test/files/results/main.txt', 'utf8'));

                    done();
                });
            });
        });
    });
});
