import React from 'react';
import caseSensitiveStringSearch from './CaseSensitiveStringSearch';

export default (props)=> {
    const { caseModifiedSearchString, indexOfModifiedSearchString } =
        caseSensitiveStringSearch(props.highlightedCharacters, props.title);

    const _props = {
        title: props.title,
        highlightIndex: indexOfModifiedSearchString,
        highlightedCharacters: caseModifiedSearchString,
    };

    return <span>{(indexOfModifiedSearchString !== -1) ? createHighlightedElement(_props) : props.title }</span>
}

function createHighlightedElement(props) {
    return [getStart(props), getMiddle(props), getEnd(props)]
}

function getStart({ title, highlightIndex }) {
    return title.substr(0, highlightIndex);
}

function getMiddle({ highlightedCharacters }) {
    return <span className="strong" key={highlightedCharacters}>{highlightedCharacters}</span>;
}

function getEnd({ title, highlightIndex, highlightedCharacters }) {
    return title.substr(highlightIndex + highlightedCharacters.length, title.length);
}