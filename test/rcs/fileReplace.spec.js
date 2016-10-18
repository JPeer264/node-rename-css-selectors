'use strict';

const rcs    = require('../../lib/utils/rcs');
const fs     = require('fs');
const expect = require('chai').expect;

describe('rcs file replace', () => {
    describe('replaceCss', () => {
        it('should replace css file and return modified selectors', done => {
            rcs.fileReplace.replace('test/files/fixtures/style.css', {}, (err, data) => {
                expect(data).to.equal(fs.readFileSync('test/files/results/style.css', 'utf8'));

                done();
            });
        });
    });
});