import { put, take } from 'redux-saga/effects';
import searchSuggestionService from './searchSuggestionService';

function* retrieveSearchSuggestion() {

    while (true) {

        const { searchTerm } = yield take('GET_SUGGESTIONS');

        const suggestions = yield searchSuggestionService.search(searchTerm);

        yield put({ type: 'SAVE_SUGGESTIONS', suggestions: suggestions });
    }
}

export default retrieveSearchSuggestion;
