'use strict';

const rcs    = require('../../lib/utils/rcs');
const expect = require('chai').expect;

describe('rcs selector library', () => {
    describe('set a new values', () => {
        it('should set a new value and get this value', done => {
            rcs.selectorLibrary.set('.test');

            expect(rcs.selectorLibrary.get('.test')).to.equal('a1');
            expect(rcs.selectorLibrary.get('test')).to.equal('a1');

            done();
        });

        it('should not get a unset value', done => {

            expect(rcs.selectorLibrary.get('.test1')).to.equal('.test1');
            expect(rcs.selectorLibrary.get('test1')).to.equal('test1');

            done();
        });

        it('should set an object value', done => {
            const setValueObject = rcs.selectorLibrary.setValue('.test');

            expect(setValueObject.type).to.equal('class');
            expect(setValueObject.selector).to.equal('.test');
            expect(setValueObject.compressedSelector).to.equal('a1');

            done();
        });
    });
});