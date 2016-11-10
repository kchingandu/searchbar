import { assert } from 'chai';
import caseSensitiveStringSearch from './CaseSensitiveStringSearch';

describe('CaseSensitiveStringSearch', () => {
    it('should priorities the uppercase instance of the searched letter', () => {
        const result = caseSensitiveStringSearch('a', 'aA');

        assetCaseAndIndexOfModifiedSearchString(result, 'A', 1);
    });

    it('should priorities the uppercase case instance of the searched sequence of characters', () => {
        const result = caseSensitiveStringSearch('ab', 'abc Abc');

        assetCaseAndIndexOfModifiedSearchString(result, 'Ab', 4);
    });

    it('should return the lower case instance of the searched letter when in the absence of the uppercase equivalent', () => {
        const result = caseSensitiveStringSearch('a', 'xyz abc');

        assetCaseAndIndexOfModifiedSearchString(result, 'a', 4);
    });

    it('can support multi case searched sequence of characters', () => {
        const result = caseSensitiveStringSearch('aB', 'aBc');

        assetCaseAndIndexOfModifiedSearchString(result, 'aB', 0);
    });

    it('can support spaces between searched characters (sentence)', () => {
        const result = caseSensitiveStringSearch('a sentence with spaces', 'a sentence with spaces');

        assetCaseAndIndexOfModifiedSearchString(result, 'a sentence with spaces', 0);
    });

    function assetCaseAndIndexOfModifiedSearchString(result, expectedString, expectedIndex) {
        assert.equal(result.caseModifiedSearchString, expectedString);
        assert.equal(result.indexOfModifiedSearchString, expectedIndex);
    }
});
