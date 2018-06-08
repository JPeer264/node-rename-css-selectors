const fs = require('fs-extra');
const path = require('path');
const expect = require('chai').expect;

const saveSync = require('../saveSync');

const testCwd = 'test/files/testCache';

describe('saveSync', () => {
  afterEach(() => {
    fs.removeSync(testCwd);
  });

  it('saveSync | should save', () => {
    const filePath = path.join(testCwd, '/config.txt');

    saveSync(filePath, 'test content');

    expect(fs.readFileSync(filePath, 'utf8')).to.equal('test content');
  });

  it('saveSync | should not overwrite the same file', () => {
    const filePath = path.join(testCwd, '/../config.json');
    const oldFile = fs.readFileSync(filePath, 'utf8');
    let failed = false;

    try {
      saveSync(filePath, 'test content');

      // if no error is thrown before it should fail here
      failed = true;
    } catch (e) {
      expect(e.message).to.equal('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
    }

    expect(failed).to.equal(false);
    expect(fs.readFileSync(filePath, 'utf8')).to.equal(oldFile);
  });
});
