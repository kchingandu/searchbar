/*
 *
 * Search API
 *
 */

import * as adapters from './adapters';
import pathFactory from './paths';

import {
  jsonRequest,
} from '../utils';

const searchFactory = (clientId, endpoints, region) => {
  const paths = pathFactory(clientId, endpoints, region);
  const userId = 1;
  const section = 'home';
  return {
    getSuggestions(term) {
      // Query params: "limit" - number of suggestions. Default is 20.
      // filters: src and flag.
      // http://wiki.skycdc.com/display/ser/Entity+Suggest#EntitySuggest-ResponseBodyExample
      // There is some info in the response header to deal with.
      return jsonRequest(paths.searchSuggestPath(section, userId, term)).then(results =>
        adapters.suggestionsAdapter(results, section, userId)
      );
    },
    getResults(suggestion) {
      return jsonRequest(paths.searchResultsPath(suggestion)).then(results =>
        adapters.resultsAdapter(results)
      );
    },
  };
};

export default searchFactory;
