import pathFactory from '../paths';

import { assert } from 'chai';
// import { shallow } from 'enzyme';
// import React from 'react';

describe('On Demand Paths', () => {
  let endpoints;
  let paths;
  beforeEach(() => {
    const root = '';
    endpoints = {
      searchSuggestions: `${root}/suggest/v1/{clientid}/{section}/{bouquetId}/{subBouquetId}/{userid}?term={term}&src=ott&limit=7`,
      searchResults: `${root}/entity/search/v1/{clientid}/{section}/{bouquetId}/{subBouquetId}/{userid}/{uuidtype}/{uuid}`,
    };
    const clientId = 'skyclient';
    const region = {
      bouquetId: 1234,
      subBouquetId: 5,
      fieldTrial: null,
    };
    paths = pathFactory(clientId, endpoints, region);
  });

  it('Expect SearchSuggest to be correct', () => {
    assert.equal(
      paths.searchSuggestPath('home', 'myUserId', 'fishing'),
      '/suggest/v1/skyclient/home/1234/5/myUserId?term=fishing&src=ott&limit=7');
  });

  it('Expect SearchResultsPath to be correct when suggestion passed', () => {
    const suggestion = {
      section: 'section1',
      userId: 'userId2',
      uuidtype: 'uuidType3',
      uuid: 'uuid4',
    };
    assert.equal(
      paths.searchResultsPath(suggestion),
      '/entity/search/v1/skyclient/section1/1234/5/userId2/uuidType3/uuid4');
  });
});
