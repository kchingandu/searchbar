import sinon from 'sinon';
import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import SuggestionsPanel from './SuggestionsPanel';

describe('SuggestionPanel', () => {
    let suggestionsPanel;
    let firstSuggestionItem;

    const props = {
        highlightedItemIndex: -1,
        onSelection: sinon.stub(),
        onItemRollover: sinon.stub(),
        suggestions: [{ title: 'title 1' }, { title: 'title 2' }],
    };

    it('should render suggestions', () => {
        assert.equal(suggestionsPanel.children().length, 2);
        assert.include(suggestionsPanel.html(), props.suggestions[0].title);
        assert.include(suggestionsPanel.html(), props.suggestions[1].title);
    });

    it('should disable the default mouse down behaviour. ' +
        'This prevents the search input losing focus have the undesirable effect of hiding this panel', () => {
        const mockEvent = { preventDefault: sinon.stub() };

        suggestionsPanel.simulate('mouseDown', mockEvent);

        assert.isTrue(mockEvent.preventDefault.called);
    });

    it('should highlight a suggestion item externally through props', () => {

        suggestionsPanel.setProps({ highlightedItemIndex: -1 });

        assert.equal(suggestionsPanel.find('.highlighted').length, 0);

        suggestionsPanel.setProps({ highlightedItemIndex: 0 });

        assert.equal(suggestionsPanel.find('.highlighted').length, 1);
        assert.isTrue(suggestionsPanel.childAt(0).hasClass('highlighted'));

    });

    it('should disable the highlight index on mouse out', () => {
        suggestionsPanel.setProps({ highlightedItemIndex: 0 });

        assert.equal(suggestionsPanel.find('.highlighted').length, 1);

        suggestionsPanel.simulate('mouseLeave');

        let highlightedItemIndex = props.onItemRollover.args[0][0];

        suggestionsPanel.setProps({ highlightedItemIndex });

        assert.equal(suggestionsPanel.find('.highlighted').length, 0)
    });

    it('should call the provided handler when the suggestion item is selected', () => {
        firstSuggestionItem.simulate('click');

        assert.isTrue(props.onSelection.calledWithExactly(props.suggestions[0]));
    });

    it('should disable the mouses ability to highlight a suggestion item if the highlight index is set via props', () => {
        firstSuggestionItem.simulate('mouseMove');

        assert.isFalse(suggestionsPanel.state('mouseOverDisabled'));

        suggestionsPanel.setProps({ highlightedItemIndex: 0 });

        assert.isTrue(suggestionsPanel.state('mouseOverDisabled'));
    });


    it('should enable the mouse over disabled when the mouse is moving as well as update with the element the mouse is currently over ', () => {

        firstSuggestionItem.simulate('mouseMove');

        assert.isFalse(suggestionsPanel.state('mouseOverDisabled'));

        suggestionsPanel.setProps({ highlightedItemIndex: 0 });

        assert.isTrue(suggestionsPanel.state('mouseOverDisabled'));

        assert.isTrue(props.onItemRollover.calledWithExactly(0));
    });

    describe('scroll suggestion into view', ()=> {
        let scrollIntoViewIfNeededCalled;
        let scrollIntoViewIfNeededArgument;

        it('should scroll into view an off screen suggestion highlighted through the use of the keyboard', () => {

            suggestionsPanel.setProps({ highlightedItemIndex: 0 });

            assert.isTrue(scrollIntoViewIfNeededCalled);
            assert.isFalse(scrollIntoViewIfNeededArgument);
        });

        it('should not call the scroll into view if the mouse over is enabled', () => {
            suggestionsPanel.setState({ mouseOverDisabled: false });

            assertScrollIntoViewIfNeededNotCalled();
        });

        it('should not call the scroll into view if the mouse over is enabled', () => {
            suggestionsPanel.setProps({ highlightedItemIndex: -1 });

            assertScrollIntoViewIfNeededNotCalled();
        });

        function assertScrollIntoViewIfNeededNotCalled() {
            assert.isFalse(scrollIntoViewIfNeededCalled);
            assert.isNull(scrollIntoViewIfNeededArgument);
        }

        beforeEach(() => {
            scrollIntoViewIfNeededArgument = null;
            scrollIntoViewIfNeededCalled = false;

            Element.prototype.scrollIntoViewIfNeeded = (e)=> {
                scrollIntoViewIfNeededArgument = e;
                scrollIntoViewIfNeededCalled = true;
            };
        });

        afterEach(() => {
            delete Element.prototype.scrollIntoViewIfNeeded;
        })
    });

    beforeEach(() => {
        suggestionsPanel = mount(<SuggestionsPanel {...props}/>);

        firstSuggestionItem = suggestionsPanel.childAt(0);
    });
});
