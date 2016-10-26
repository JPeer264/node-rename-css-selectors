'use strict';

const rcs    = require('../../lib/utils/rcs');
const expect = require('chai').expect;

describe('rcs selector library', () => {
    describe('set new values', () => {
        beforeEach(() => {
            // reset counter and selectors for tests
            rcs.selectorLibrary.selectors = {};
            rcs.nameGenerator.resetCountForTests();
        });

        it('should set a new value and get this value', done => {
            rcs.selectorLibrary.set('.test');

            expect(rcs.selectorLibrary.get('.test')).to.equal('a');
            expect(rcs.selectorLibrary.get('test')).to.equal('a');

            done();
        });

        it('should set an object value', done => {
            const setValueObject = rcs.selectorLibrary.setValue('.test');

            expect(setValueObject.type).to.equal('class');
            expect(setValueObject.selector).to.equal('.test');
            expect(setValueObject.compressedSelector).to.equal('a');

            done();
        });

        it('should set values out of an array', done => {
            rcs.selectorLibrary.set([
                '.test',
                '#id',
                '.jp-selector'
            ]);

            // should be set
            expect(rcs.selectorLibrary.get('.test')).to.equal('a');
            expect(rcs.selectorLibrary.get('test')).to.equal('a');
            expect(rcs.selectorLibrary.get('#id')).to.equal('b');
            expect(rcs.selectorLibrary.get('id')).to.equal('b');
            expect(rcs.selectorLibrary.get('.jp-selector')).to.equal('c');
            expect(rcs.selectorLibrary.get('jp-selector')).to.equal('c');

            // should not be set
            expect(rcs.selectorLibrary.get('.not-set')).to.equal('.not-set');
            expect(rcs.selectorLibrary.get('not-set')).to.equal('not-set');

            done();
        });
    });

    describe('get values', () => {
        beforeEach(() => {
            // reset counter and selectors for tests
            rcs.selectorLibrary.selectors = {};
            rcs.nameGenerator.resetCountForTests();

            rcs.selectorLibrary.set([
                '.test',
                '#id',
                '.jp-selector'
            ]);
        });

        it('should not get a unset value', done => {
            expect(rcs.selectorLibrary.get('.test1')).to.equal('.test1');
            expect(rcs.selectorLibrary.get('test1')).to.equal('test1');

            done();
        });

        it('should get all setted classes', done => {
            const array = rcs.selectorLibrary.getAll();

            expect(array).to.be.an('object');
            expect(array.test).to.equal('a');
            expect(array.id).to.equal('b');
            expect(array['jp-selector']).to.equal('c');

            done();
        });

        it('should get all setted compressed classes', done => {
            const array = rcs.selectorLibrary.getAll({
                origValues: false,
            });

            expect(array).to.be.an('object');
            expect(array.a).to.equal('test');
            expect(array.b).to.equal('id');
            expect(array.c).to.equal('jp-selector');

            done();
        });

        it('should return a regex of compressed with classes', done => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: false,
                regex: true,
                isSelectors: true
            });

            expect(regex).to.match(/\.a|#b|\.c/g);

            done();
        });

        it('should return a regex of non compressed with classes', done => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: true,
                regex: true,
                isSelectors: true
            });

            expect(regex).to.match(/\.test|#id|\.jp-selector/g);

            done();
        });

        it('should return a regex of non compressed selecotrs', done => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: false,
                regex: true
            });

            expect(regex).to.match(/a|b|c/g);

            done();
        });

        it('should return a regex of compressed selectors', done => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: true,
                regex: true
            });

            expect(regex).to.match(/test|id|jp-selector/g);

            done();
        });

        it('should get all extended', done => {
            const cssObject = rcs.selectorLibrary.getAll({
                extended: true
            });

            expect(cssObject['test']).to.be.an('object');
            expect(cssObject['test'].type).to.equal('class');
            expect(cssObject['test'].compressedSelector).to.equal('a');

            expect(cssObject['id']).to.be.an('object');
            expect(cssObject['id'].type).to.equal('id');
            expect(cssObject['id'].compressedSelector).to.equal('b');

            done();
        });

        it('should get all extended with selectors', done => {
            const cssObject = rcs.selectorLibrary.getAll({
                isSelectors: true,
                extended: true
            });

            expect(cssObject['.test']).to.be.an('object');
            expect(cssObject['.test'].type).to.equal('class');
            expect(cssObject['.test'].compressedSelector).to.equal('a');

            expect(cssObject['#id']).to.be.an('object');
            expect(cssObject['#id'].type).to.equal('id');
            expect(cssObject['#id'].compressedSelector).to.equal('b');

            done();
        });

        it('should get all normal with selectors', done => {
            const cssObject = rcs.selectorLibrary.getAll({
                origValues: false,
                isSelectors: true,
                extended: true
            });

            expect(cssObject['.a']).to.be.an('object');
            expect(cssObject['.a'].type).to.equal('class');
            expect(cssObject['.a'].modifiedSelector).to.equal('test');

            expect(cssObject['#b']).to.be.an('object');
            expect(cssObject['#b'].type).to.equal('id');
            expect(cssObject['#b'].modifiedSelector).to.equal('id');

            done();
        });
    });
});
