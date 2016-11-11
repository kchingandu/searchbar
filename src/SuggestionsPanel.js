import ReactDOM from 'react-dom';
import classNames from 'classnames';
import SuggestionTitle from './SuggestionTitle';
import React, { Component } from 'react';

class SuggestionsPanel extends Component {
    constructor(props) {
        super(props);

        this.state = { mouseOverDisabled: true };
    }

    componentDidUpdate() {
        if (this.state.mouseOverDisabled) {
            const list = ReactDOM.findDOMNode(this.refs.panel);

            const activeItem = list.querySelector('.highlighted');

            if (activeItem && activeItem.scrollIntoViewIfNeeded) {
                activeItem.scrollIntoViewIfNeeded(false);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const mouseOverDisabled = nextProps.highlightedItemIndex !== this.props.highlightedItemIndex;
        this.setState({ mouseOverDisabled });
    }

    render() {
        const { mouseOverDisabled } = this.state;
        const { onSelection, suggestions, searchTerm, onItemRollover } = this.props;

        return (
            <ul ref="panel"
                className="search-bar-suggestions"
                onMouseLeave={() => onItemRollover(-1)}
                onMouseDown={(e) => e.preventDefault()}>

                {suggestions.map((suggestion, index) =>

                    <li key={index}
                        onClick={() => onSelection(suggestion)}
                        onMouseEnter={() => !mouseOverDisabled && onItemRollover(index)}
                        onMouseMove={ ()=> {
                            if (mouseOverDisabled) {
                                onItemRollover(index);
                                this.setState({ mouseOverDisabled: false })
                            }
                        }}
                        className={classNames({
                            highlighted: this.props.highlightedItemIndex === index,
                        })}>

                        <SuggestionTitle title={suggestion.title}
                                         highlightedCharacters={searchTerm}/>
                    </li>
                )}
            </ul>
        );
    }
}

SuggestionsPanel.propTypes = {
    onSelection: React.PropTypes.func,
    onItemRollover: React.PropTypes.func,
    highlightedItemIndex: React.PropTypes.number,
    suggestions: React.PropTypes.array.isRequired,
};

export default SuggestionsPanel;
