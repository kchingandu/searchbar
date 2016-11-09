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
    componentDidUpdate(){


    }
    formatTitle(searchTerm, suggestion) {

        let title = suggestion.title;

        let result = title;

        let modifiedCaseSearchTerm = upperCaseFirstLetter(searchTerm);

        let positionOfModifiedCaseSearchTerm = title.search(modifiedCaseSearchTerm);

        if (positionOfModifiedCaseSearchTerm === -1) {
            modifiedCaseSearchTerm = searchTerm.toLowerCase();
            positionOfModifiedCaseSearchTerm = title.search(modifiedCaseSearchTerm);
        }

        if (positionOfModifiedCaseSearchTerm === -1) {
            modifiedCaseSearchTerm = searchTerm;
            positionOfModifiedCaseSearchTerm = title.search(modifiedCaseSearchTerm);
        }

        if (positionOfModifiedCaseSearchTerm !== -1) {
            result = [
                title.substr(0, positionOfModifiedCaseSearchTerm),
                <span className="strong" key={searchTerm}>{modifiedCaseSearchTerm}</span>,
                title.substr(positionOfModifiedCaseSearchTerm + searchTerm.length, title.length)
            ]
        }

        function upperCaseFirstLetter(text) {
            return text
                .toLowerCase()
                .split(' ')
                .map((word)=> {
                    return word[0].toUpperCase() + word.substr(1);
                })
                .join(' ');
        }

        return result;
    }

    render() {
        const { highlightedItemIndex, onSelection, suggestions, searchTerm } = this.props;

        const { activeItem } = this.state;

        return (
            <ul className="search-bar-suggestions"
                ref="list"
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
                            highlighted: highlightedItemIndex === index || activeItem === index
                        })}>
                        { this.formatTitle(searchTerm, suggestion) }
                    </li>
                )}
            </ul>
        );
    }
}

Suggestions.propTypes = {
    onSelection: React.PropTypes.func,
    highlightedItemIndex: React.PropTypes.number,
    suggestions: React.PropTypes.array.isRequired,
};

export default Suggestions;
