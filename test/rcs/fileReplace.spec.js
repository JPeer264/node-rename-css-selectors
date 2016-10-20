'use strict';

const rcs    = require('../../lib/utils/rcs');
const fs     = require('fs');
const expect = require('chai').expect;

describe('rcs file replace', () => {
    describe('replaceCss', () => {
        beforeEach(() => {
            // reset counter and selectors for tests
            rcs.selectorLibrary.selectors = {};
            rcs.nameGenerator.resetCountForTests();
        });

        it('should replace css file and return modified selectors', done => {
            rcs.fileReplace.replaceCss('test/files/fixtures/style.css', {}, (err, data) => {
                expect(data).to.equal(fs.readFileSync('test/files/results/style.css', 'utf8'));

                done();
            });
        });
    });
});
