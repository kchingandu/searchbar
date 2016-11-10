import React from 'react';
import classNames from 'classnames';
import Suggestions from './Suggestions'; //eslint-disable-line no-unused-vars
const keyCodes = { UP: 38, DOWN: 40, ENTER: 13, ESCAPE: 27 };

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.createState();

        this.bindFunctions();
    }

    createState() {
        this.state = this.initialState = { inputValue: '', highlightedItemIndex: -1 };
    }

    bindFunctions() {
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onSelection = this.onSelection.bind(this);
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            this.refs.input.focus();
        }
    }

    onKeyDown(e) {
        const key = e.which || e.keyCode;

        if (key === keyCodes.UP || key === keyCodes.DOWN) {
            e.preventDefault();
            this.scroll(key);
        }
        else if (key === keyCodes.ENTER) {
            this.search();
        }
        else if (key === keyCodes.ESCAPE) {
            this.refs.input.blur();
        }
    }

    scroll(key) {
        const { highlightedItemIndex: itemIndex, suggestions = this.props.suggestions } = this.state;

        const lastItemIndex = suggestions.length - 1;

        let nextItemIndex;

        if (key === keyCodes.UP) {
            nextItemIndex = (itemIndex <= 0) ? lastItemIndex : itemIndex - 1;
        } else {
            nextItemIndex = (itemIndex === lastItemIndex) ? 0 : itemIndex + 1;
        }

        this.setState({ highlightedItemIndex: nextItemIndex, inputValue: suggestions[nextItemIndex].title || '' });
    }

    search() {
        if (this.state.inputValue) {
            const value = this.normalizeInputValue();

            clearTimeout(this.timer);

            this.refs.input.blur();

            const { highlightedItemIndex } = this.initialState;

            this.setState({ highlightedItemIndex });

            if (this.props.onSearch) {
                this.props.onSearch(value);
            }
        }
    }

    onChange(e) {
        clearTimeout(this.timer);

        const input = e.target.value;

        if (!input) {
            this.setState(this.initialState);
        }

        this.setState({ inputValue: input });

        this.timer = setTimeout(() => this.autoSuggest(), this.props.delay);
    }

    autoSuggest() {
        const searchTerm = this.normalizeInputValue();

        this.props.onChange(searchTerm);
        this.setState({ highlightedItemIndex: -1 });
    }

    normalizeInputValue() {
        return this.state.inputValue.toLowerCase().trim();
    }

    onSelection(suggestion) {
        this.setState({ inputValue: suggestion.title }, () => this.search());
    }

    onSearch(e) {
        e.preventDefault();
        this.search();
    }

    shouldRenderSuggestion() {
        return  this.state.inputValue && this.props.suggestions.length > 0;
    }

    shouldRenderNoSuggestion() {
        return this.state.isFocused && this.state.inputValue && this.props.suggestions.length === 0 && this.props.enableNoSuggestionsPanel
    }

    updateHighlightedItemIndex(highlightedItemIndex) {
        this.setState({ highlightedItemIndex });
    }

    render() {

        return (
            <div className="search-bar-wrapper">

                <div className={classNames(
                    'search-bar-field',
                    { 'is-focused': this.state.isFocused },
                    { 'has-suggestions': this.props.suggestions.length > 0 })}>

                    <input ref="input"
                           type="text"
                           maxLength="100"
                           autoCorrect="off"
                           autoComplete="off"
                           autoCapitalize="none"
                           onChange={this.onChange}
                           name={this.props.inputName}
                           className="search-bar-input"
                           value={this.state.inputValue}
                           placeholder={this.props.placeholder}
                           onFocus={() => this.setState({ isFocused: true })}
                           onBlur={() => this.setState({ isFocused: false })}
                           onKeyDown={this.props.suggestions && this.onKeyDown}
                    />

                    { this.state.inputValue &&

                    <span className="icon search-bar-clear"
                          onClick={() => this.setState(this.initialState)}/>
                    }

                    <input type="submit"
                           onClick={this.onSearch}
                           className="icon search-bar-submit"/>
                </div>

                { this.shouldRenderSuggestion() &&

                <Suggestions onSelection={this.onSelection}
                             searchTerm={this.state.inputValue}
                             suggestions={this.props.suggestions}
                             highlightedItemIndex={this.state.highlightedItemIndex}
                             onItemRollover={(index)=> {
                                 this.updateHighlightedItemIndex(index);
                             }}/>
                }

                { this.shouldRenderNoSuggestion() &&

                <div className="search-bar-no-results">No search results found</div>
                }

            </div>
        );
    }
}

SearchBar.defaultProps = {
    delay: 200,
    autoFocus: true,
};

SearchBar.propTypes = {

    delay: React.PropTypes.number,
    onSearch: React.PropTypes.func,
    autoFocus: React.PropTypes.bool,
    inputName: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    enableNoSuggestionsPanel: React.PropTypes.bool,
};

export default SearchBar;
