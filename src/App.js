import React, { Component } from 'react';
import SearchBar from './SearchBar'
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);

        this.getData = this.getData.bind(this);

        this.state = { suggestions: [] };
    }

    getData(term, resolve) {

        console.log(resolve);

        const url = `http://jsonp.afeld.me/?url=http://suggest.search.sky.com/go-web?term=` + term;

        fetch(url).then((response) => {

            response.json().then((data) => {
                console.log(data.terms);

                resolve(data.terms)

            });
        });
    }

    render() {
        return (
            <div className="App">
                <SearchBar onChange={this.getData} ></SearchBar>
            </div>
        );
    }
}

export default App;
