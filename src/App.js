import './App.css';
import React from 'react';
import SearchBar from './SearchBar'
import searchBot from './searchBot';
import { connect } from 'react-redux'

const App = (props)=> {

    function getData(term) {

        searchBot.getSuggestions(term).then((result) => {
            props.onChange(result);
            //console.log(result);
        })
    }

    return (
        <div className="App">
            <SearchBar onChange={getData}
                       suggestions={props.suggestionsData.suggestions}
                       enableNoSuggestionsPanel={props.suggestionsData.isApiResponse}
                       placeholder="Search for TV shows, movies, actors or events..."/>
        </div>
    );
};

const mapStateToProps = state => {
    return { suggestionsData: state.suggestionsData};
};

const mapDisptachToProps = (dispatch) => {
    return {
        onChange: (term)=> {
            dispatch({
                type: 'GET_SUGGESTIONS',
                payload: term
            })
        }
    }
};

export default connect(mapStateToProps, mapDisptachToProps)(App);
