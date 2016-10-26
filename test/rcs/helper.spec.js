'use strict';

const rcs    = require('../../lib/utils/rcs');
const fs     = require('fs-extra');
const path   = require('path');
const expect = require('chai').expect;

const testCwd = 'test/files/testCache';

describe('helper.js', () => {
    afterEach(() => {
        fs.removeSync(testCwd);
    });

    it('should create a file within a non existing dir', done => {
        const filePath = path.join(testCwd, '/a/non/existing/path/test.txt');

        rcs.helper.save(filePath, 'test content', (err, data) => {
            expect(err).to.not.exist;

            expect(fs.existsSync(filePath)).to.be.true;
            expect(fs.readFileSync(filePath, 'utf8')).to.equal('test content');

            done();
        });
    });

    it('should generatea readable json string from a json object', done => {
        const object = { a: 1, b:2, c:3 };
        const jsonString = rcs.helper.objectToJson(object);

        expect(object).to.be.a('object');
        expect(jsonString).to.be.a('string');

        done();
    });
});
