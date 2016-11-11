import './App.css';
import SearchBar from './SearchBar'
import searchBot from './searchBot';
import { connect } from 'react-redux'
import React, { Component }from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { showSearchBar: true };
        this.getData = this.getData.bind(this)
    }

    getData(term) {
        searchBot.getSuggestions(term).then((result) => {
            this.props.onChange(result);
        })
    }

    render() {
        return (
            <div className="search">

                <button className="icon search-toggle-button"
                        onClick={()=>this.setState({ showSearchBar: true }) }/>

                { this.state.showSearchBar && <SearchBar onChange={this.getData}
                                                         suggestions={this.props.suggestionsData.suggestions}
                                                         placeholder="Search for TV shows, movies, actors or events..."
                                                         enableNoSuggestionsPanel={this.props.suggestionsData.isApiResponse}/>
                }

                <div className="search-overlay" onClick={() =>this.setState({ showSearchBar: false })}></div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { suggestionsData: state.suggestionsData };
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
