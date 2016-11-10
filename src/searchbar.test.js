import React from 'react';
import SearchBar from './SearchBar';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

describe('SearchBar', () => {
    let searchBar;
    let setTimeoutMock;
    let searchBarInput;
    const SEARCH_TERM = 'search term';
    const SUGGESTION_TITLE = 'title 1';
    const props = {
        onChange: sinon.stub(),
        onSearch: sinon.stub(),
        suggestions: [{ title: 'title 1' }, { title: 'title 2' }],
    };

    describe('Search bar input', ()=> {

        it('should call the change handler with the users input (search term)', () => {
            searchBarInput.simulate('change', { target: { value: SEARCH_TERM } });

            setTimeoutMock.tick(220);

            assert.isTrue(props.onChange.calledWith(SEARCH_TERM));
        });

        it('should call blur when the escape key is pressed', () => {
            searchBarInput.simulate('focus', searchBarInput);

            const blur = searchBar.instance().refs.input.blur = sinon.stub();

            searchBarInput.simulate('keydown', { keyCode: 27 });

            assert.isTrue(blur.called);
        });

        it('should call the search callback when the enter key is', () => {
            searchBar.setState({ inputValue: SEARCH_TERM });

            searchBarInput.simulate('keydown', { keyCode: 13 });

            assert.isTrue(props.onSearch.calledWith(SEARCH_TERM));
        });
    });

    describe('Suggestions section', () => {

        it('should display the suggestions section', () => {
            assert.include(searchBar.html(), SUGGESTION_TITLE);
        });

        it('should not display the suggestions section when the text input looses focus ', () => {
            searchBar.setState({ isFocused: false, inputValue: true });

            assert.notInclude(searchBar.html(), SUGGESTION_TITLE);
        });

        it('should not display the suggestions section when the input value is falsey ', () => {
            searchBar.setState({ isFocused: true, inputValue: false });

            assert.notInclude(searchBar.html(), SUGGESTION_TITLE);
        });

        it('should not display the suggestions section when the suggestions array is empty', () => {
            searchBar.setProps({ suggestions: [] });

            assert.notInclude(searchBar.html(), SUGGESTION_TITLE);
        });

        it('should set the highlight index of the next available item in the suggestions array', () => {
            searchBar.setProps({ suggestions: [{ title: 'title 1' }, { title: 'title 2' }] });

            searchBarInput.simulate('keydown', { keyCode: 40 });

            assertItemIsAtFirstSuggestion();
        });

        it('should set the highlight back to the first element index after reaching the end of the list' +
            ' (continuously press the down key)', () => {
            searchBar.setProps({ suggestions: [{ title: 'title 1' }, { title: 'title 2' }] });

            searchBarInput.simulate('keydown', { keyCode: 40 });
            searchBarInput.simulate('keydown', { keyCode: 40 });
            searchBarInput.simulate('keydown', { keyCode: 40 });

            assertItemIsAtFirstSuggestion();
        });

        it('should set the highlight back to the previous index element', () => {
            searchBar.setProps({ suggestions: [{ title: 'title 1' }, { title: 'title 2' }] });

            searchBarInput.simulate('keydown', { keyCode: 40 });
            searchBarInput.simulate('keydown', { keyCode: 40 });
            searchBarInput.simulate('keydown', { keyCode: 38 });

            assertItemIsAtFirstSuggestion();
        });

        function assertItemIsAtFirstSuggestion() {

            assert.equal(searchBar.state('inputValue'), 'title 1');
            assert.equal(searchBar.state('highlightedItemIndex'), 0);

            assert.isTrue(searchBar.find('.search-bar-suggestions').childAt(0).hasClass('highlighted'));
            assert.isFalse(searchBar.find('.search-bar-suggestions').childAt(1).hasClass('highlighted'));
        }

        beforeEach(() => {
            searchBar.setState({ isFocused: true, inputValue: SEARCH_TERM });
        })
    });

    beforeEach(() => {
        setTimeoutMock = sinon.useFakeTimers();
        searchBar = mount(<SearchBar {...props}/>);
        searchBarInput = searchBar.find('.search-bar-input');
    });

    afterEach(() => {
        setTimeoutMock.restore();
    });

});
