'use strict';

var _ = require('lodash'),
    assert = require('assert'),
    filters = require('../src/filters');


describe('filters', () => {

    let URL = 'github.com',
        req = (url, param) => {
            let r = {};
            r[param || 'data'] = {
                url: url
            };
            return r;
        },
        res = (value) => {
            return {
                sendFile: () => value
            };
        };

    describe('merge', () => {
        let next = (req) => {
            return () => req.data.url;
        };

        it('should take url from body', () => {
            let r = req(URL, 'body');
            assert.equal(URL, filters.merge(r, res(), next(r)));
        });

        it('should take url from query', () => {
            let r = req(URL, 'query');
            assert.equal(URL, filters.merge(r, res(), next(r)));
        });

        it('should take from url query in priority', () => {
            let r = _.defaults(req(URL, 'query'), req(URL + URL, 'body'));
            assert.equal(URL, filters.merge(r, res(), next(r)));
        });

    });

    describe('usage', () => {
        let next = _.constant,
            usage = filters.usage({ ui: true });

        it('should depend on configuration', () => {
            assert.equal(true, null === filters.usage({}));
            assert.equal(false, null === filters.usage({ ui: true }));
        });

        it('should process url parameter', () => {
            assert.equal(true, usage(req(URL), res(false), next(true)));
        });

        it('should process next function', () => {
            assert.equal(true, usage(req(null), res(true), next(false)));
            assert.equal(true, usage(req(''), res(true), next(false)));
        });

    });

    describe('basic', () => {

        it('should depend on configuration', () => {
            assert.equal(true, null === filters.basic({}));
            assert.equal(false, null === filters.basic({ security: { basic: {} } }));
        });

    });

});
