const suggestions = (state = createInitialSuggestionData(), action) => {

    switch (action.type) {

        case 'GET_SUGGESTIONS':
            return Object.assign({}, state, { suggestionsData: { suggestions: action.payload, isApiResponse: true } });

        default:
            return state
    }
};

function createInitialSuggestionData() {
    return {
        suggestionsData: {
            suggestions: [],
            isApiResponse: false,
        }
    }
}

export default suggestions;