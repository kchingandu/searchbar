import ReactDOM from 'react-dom';
import classNames from 'classnames';
import TitleRender from './TitleRenderer';
import React, { Component } from 'react';

class Suggestions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mouseOverDisabled: true
        };
    }

    onTouchStart(index) {
        this.timer = setTimeout(() => {
            this.setState({ rolledOver: index });
        }, 200);
    }

    onTouchMove() {
        clearTimeout(this.timer);

        this.touchedMoved = true;

        this.setState({ highlightedItemIndex: -1 });
    }

    onTouchEnd(suggestion) {
        if (!this.touchedMoved) {

            setTimeout(() => {
                this.props.onSelection(suggestion);
            }, 220);
        }
        this.touchedMoved = false;
    }

    componentDidUpdate() {

        //this.refs.list.focus();

        if (this.state.mouseOverDisabled) {
            const list = ReactDOM.findDOMNode(this.refs.list);

            const activeItem = list.querySelector('.highlighted');

            if (activeItem) {
                activeItem.scrollIntoViewIfNeeded(false);
            }
        } else {
            console.log('not scrolling into view');

        }
    }

    componentWillReceiveProps(nextProps) {
        const mouseOverDisabled = nextProps.highlightedItemIndex !== this.props.highlightedItemIndex;
        this.setState({ mouseOverDisabled });
    }

    render() {
        const { onSelection, suggestions, searchTerm } = this.props;

        return (
            <ul ref="list"
                /*tabIndex="0"
                onKeyDown={(e)=>{console.log('key',e.keycode)
                }}*/
                className="search-bar-suggestions"
                onMouseLeave={() => this.setState({ rolledOver: -1 })}>

                {suggestions.map((suggestion, index) =>

                    <li key={index}
                        onTouchMove={() => this.onTouchMove()}
                        onMouseDown={(e) => e.preventDefault()}
                        onTouchStart={() => this.onTouchStart(index)}
                        onTouchEnd={() => this.onTouchEnd(suggestion)}
                        onClick={() => onSelection(suggestion)}
                        onMouseEnter={() => {
                            if (!this.state.mouseOverDisabled) {
                                console.log('rolly poo!');
                                this.props.onItemRollover(index)
                            }
                        }}
                        onMouseMove={ ()=> {
                            if (this.state.mouseOverDisabled) {
                                this.setState({ mouseOverDisabled: false });
                            }
                        }}
                        className={classNames({
                            highlighted: this.props.highlightedItemIndex === index,
                        })}>

                        <TitleRender title={suggestion.title}
                                     highlightedCharacters={searchTerm}/>
                    </li>
                )}
            </ul>
        );
    }
}

Suggestions.propTypes = {
    onSelection: React.PropTypes.func,
    onItemRollover: React.PropTypes.func,
    highlightedItemIndex: React.PropTypes.number,
    suggestions: React.PropTypes.array.isRequired,
};

export default Suggestions;
