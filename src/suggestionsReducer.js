const suggestions = (state = createInitialSuggestionData(), { type, suggestions }) => {

    switch (type) {

        case 'SAVE_SUGGESTIONS':
            return Object.assign({}, state, { suggestionsData: { suggestions, isApiResponse: true } });

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