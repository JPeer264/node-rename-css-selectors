const fs = require('fs-extra');
const path = require('path');
const expect = require('chai').expect;

const save = require('../save');

const testCwd = 'test/files/testCache';

describe('save', () => {
  afterEach(() => {
    fs.removeSync(testCwd);
  });

  it('should create a file within a non existing dir', (done) => {
    const filePath = path.join(testCwd, '/a/non/existing/path/test.txt');

    save(filePath, 'test content', (err) => {
      expect(err).not.to.equal(undefined);

      expect(fs.existsSync(filePath)).to.equal(true);
      expect(fs.readFileSync(filePath, 'utf8')).to.equal('test content');

      done();
    });
  });

  it('should not overwrite the same file', (done) => {
    const filePath = path.join(testCwd, '/../config.json');
    const oldFile = fs.readFileSync(filePath, 'utf8');

    save(filePath, 'test content', (err) => {
      expect(err.message).to.equal('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
      expect(fs.readFileSync(filePath, 'utf8')).to.equal(oldFile);

      done();
    });
  });
});
