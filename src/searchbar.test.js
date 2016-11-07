import React from 'react';
import SearchBar from './SearchBar';
import { assert } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

describe('SearchBar', () => {
    let searchBar;
    let setTimeoutMock;
    let searchBarInput;
    const props = { suggestions: [], onChange: sinon.stub(), delay: 0 };

    it('should call the change handler with the users input (search term)', () => {
        const SEARCH_TERM = 'search term';

        searchBarInput.simulate('change', { target: { value: SEARCH_TERM } });

        setTimeoutMock.tick(0);

        assert.isTrue(props.onChange.calledWith(SEARCH_TERM));
    });

    it('should call the change handler with the users input (search term)', () => {
        const w = mount(<SearchBar {...props}/>);
        //console.log(w.find('.search-bar-input'));
        // w.find('.search-bar-input').simulate('blur');
        // console.log(w.state('isFocused'));
        // w.find('.search-bar-input').simulate('focus');
        // console.log(w.state('isFocused'));
    });

    beforeEach(() => {
        searchBar = shallow(<SearchBar {...props}/>);
        searchBarInput = searchBar.find('.search-bar-input');
        setTimeoutMock = sinon.useFakeTimers();
    });

    afterEach(() => {
        setTimeoutMock.restore();
    });
});
