import './App.css';
import SearchBar from './SearchBar'
import { connect } from 'react-redux'
import React, { Component }from 'react';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { showSearchBar: true };
    }

    render() {
        return (
            <div className="search">

                <button className="icon search-toggle-button"
                        onClick={()=>this.setState({ showSearchBar: true }) }/>

                { this.state.showSearchBar && <SearchBar onChange={this.props.onChange}
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
            term && dispatch({
                type: 'GET_SUGGESTIONS',
                searchTerm: term
            })
        }
    }
};

export default connect(mapStateToProps, mapDisptachToProps)(App);
