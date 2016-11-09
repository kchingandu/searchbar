import {
  replaceRegion,
  replaceTokens,
} from '../utils';

const pathFactory = (clientId, endpoints, region) => {
  const replace = (url, tokens) => replaceRegion(replaceTokens(url, tokens), region);
  return {
    searchSuggestPath(section, userId, term) {
      // TERM: The term to suggest by. All characters are allowed but '/'
      // I have stripped everything but letters and digits.
      const safeTerm = term.replace(/[^\w\s]/gi, '');
      const { searchSuggestions } = endpoints;
      return replace(searchSuggestions, {
        clientId,
        section,
        userId,
        term: safeTerm,
      });
    },
    searchResultsPath(suggestion) {
      const { searchResults } = endpoints;
      const { section, userId, uuidtype, uuid } = suggestion;
      return replace(searchResults, {
        clientId,
        section,
        userId,
        uuidtype,
        uuid,
      });
    },
  };
};

export default pathFactory;
