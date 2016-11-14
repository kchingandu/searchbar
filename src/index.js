import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import suggestionsReducer from './suggestionsReducer';
import retrieveSearchSuggestion from './retrieveSearchSuggestionSaga';

const sagaMiddleware = createSagaMiddleware();

let store = createStore(suggestionsReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(retrieveSearchSuggestion);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);