import sinon from 'sinon';
import { assert } from 'chai';
import { take, put } from 'redux-saga/effects';
import  retrieveSearchSuggestion from './retrieveSearchSuggestionSaga'
import * as searchSuggestionServiceModuleExports from './searchSuggestionService';

let searchSuggestionServiceStub;
let searchSuggestionServiceOriginal;
const mockSuggestion = [{ title: 'title 1' }, { title: 'title 2' }, { title: 'title 3' }];


describe('RetrieveSearchSuggestionSaga', () => {
    let generator;

    it('should listen for the GET_SUGGESTIONS event', () => {
        assert.deepEqual(generator.next().value, take('GET_SUGGESTIONS'));
    });

    it('should call the search api with the provided search term', () => {
        generator.next();

        generator.next({ searchTerm: 'search' });

        assert.isTrue(searchSuggestionServiceStub.search.calledWithExactly('search'))
    });

    it('should call the search api with the provided search term', () => {
        generator.next();

        generator.next({ searchTerm: 'search' });

        assert.deepEqual(generator.next(mockSuggestion).value, put({
            type: 'SAVE_SUGGESTIONS',
            suggestions: mockSuggestion
        }));
    });

    beforeEach(() => {
        generator = retrieveSearchSuggestion();

        stubSearchSuggestionService();
    });

    afterEach(restoreStubs);
});

function stubSearchSuggestionService() {
    searchSuggestionServiceOriginal = searchSuggestionServiceModuleExports.default;
    searchSuggestionServiceStub = searchSuggestionServiceModuleExports.default = sinon.stub({ search: Function.prototype });
}

function restoreStubs() {
    searchSuggestionServiceModuleExports.default = searchSuggestionServiceOriginal;
}
