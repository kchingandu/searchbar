import './App.css';
import SearchBar from './SearchBar'
import { connect } from 'react-redux'
import React from 'react';

const App = (props)=> {

    /*getData(term, resolve)
     {

     console.log(this.props);

     const url = `http://suggest.search.sky.com/go-web?term=` + term;

     fetch(url).then((response) => {

     response.json().then((data) => {
     resolve(data.terms)

     });
     });
     }*/

    return (
        <div className="App">
            <SearchBar onChange={props.onChange}
                       suggestions={props.suggestions}/>
        </div>
    );
};

const mapStateToProps = state => {
    return { suggestions: state.suggestions };
};

const mapDisptachToProps = (dispatch) => {
    return {
        onChange: (term)=> {
            console.log('>> ::',term);

            dispatch({
                type: 'GET_SUGGESTIONS',
                payload: term
            })
        }
    }
};

export default connect(mapStateToProps, mapDisptachToProps)(App);
