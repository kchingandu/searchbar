import classNames from 'classnames';
import React, { Component } from 'react';

class Suggestions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: -1
        };
    }

    onTouchStart(index) {
        this.timer = setTimeout(() => {
            this.setState({ activeItem: index });
        }, 200);
    }

    onTouchMove() {
        clearTimeout(this.timer);

        this.touchedMoved = true;

        this.setState({ activeItem: -1 });
    }

    onTouchEnd(suggestion) {
        if (!this.touchedMoved) {

            setTimeout(() => {
                this.props.onSelection(suggestion);
            }, 220);
        }
        this.touchedMoved = false;
    }

    render() {
        const { highlightedItem, onSelection, suggestions } = this.props;

        const { activeItem } = this.state;

        return (
            <ul className="search-bar-suggestions"

                onMouseLeave={() => this.setState({ activeItem: -1 })}>

                {suggestions.map((suggestion, index) =>

                    <li key={index}
                        onTouchMove={() => this.onTouchMove()}
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={() => this.onTouchStart(index)}
                        onTouchEnd={() => this.onTouchEnd(suggestion)}
                        onClick={() => onSelection(suggestion)}
                        onMouseEnter={() => this.setState({ activeItem: index })}
                        className={classNames({
                            highlighted: highlightedItem === index || activeItem === index
                        })}>
                        <strong>{suggestion.t}</strong>
                    </li>
                )}
            </ul>
        );
    }
}

Suggestions.propTypes = {
    onSelection: React.PropTypes.func,
    highlightedItem: React.PropTypes.number,
    suggestions: React.PropTypes.array.isRequired,
};

export default Suggestions;
