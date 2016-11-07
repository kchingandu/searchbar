const suggestions = (state = { suggestions: [] }, action) => {

    switch (action.type) {

        case 'GET_SUGGESTIONS':
            let newSuggestions = [...state.suggestions, { t: action.payload }];
            let o = Object.assign({}, state, { suggestions: newSuggestions });
            return o;
        default:
            return state
    }
};

export default suggestions;