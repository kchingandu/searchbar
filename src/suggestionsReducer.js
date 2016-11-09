const suggestions = (state = { suggestions: [] }, action) => {

    switch (action.type) {

        case 'GET_SUGGESTIONS':
            return Object.assign({}, state, { suggestions: action.payload });

        default:
            return state
    }
};

export default suggestions;