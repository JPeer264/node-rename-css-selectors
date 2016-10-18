'use strict';

const rcs    = require('../../lib/utils/rcs');
const expect = require('chai').expect;

describe('rcs selector library', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.selectors = {};
        rcs.nameGenerator.resetCountForTests();
    });

    describe('set a new values', () => {
        it('should set a new value and get this value', done => {
            rcs.selectorLibrary.set('.test');

            expect(rcs.selectorLibrary.get('.test')).to.equal('e');
            expect(rcs.selectorLibrary.get('test')).to.equal('e');

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
            expect(setValueObject.compressedSelector).to.equal('e');

            done();
        });

        it('should set values out of an array', done => {
            rcs.selectorLibrary.set([
                '.test',
                '#id',
                '.jp-selector'
            ]);

            // should be set
            expect(rcs.selectorLibrary.get('.test')).to.equal('e');
            expect(rcs.selectorLibrary.get('test')).to.equal('e');
            expect(rcs.selectorLibrary.get('#id')).to.equal('t');
            expect(rcs.selectorLibrary.get('id')).to.equal('t');
            expect(rcs.selectorLibrary.get('.jp-selector')).to.equal('n');
            expect(rcs.selectorLibrary.get('jp-selector')).to.equal('n');

            // should not be set
            expect(rcs.selectorLibrary.get('.not-set')).to.equal('.not-set');
            expect(rcs.selectorLibrary.get('not-set')).to.equal('not-set');

            done();
        });
    });
});