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
      ondemandCatalog: `${root}/ondemand/{bouquetId}/{subBouquetId}/cataloguenode`,
      ondemandCatalogNode: `${root}/ondemand/{bouquetId}/{subBouquetId}/cataloguenode/{nodeId}`,
      ondemandBookmark: `${root}/ondemand/{bouquetId}/{subBouquetId}/cataloguebookmark/{bookmark}`,

      ondemandContentDetails: '/ondemand/contentdetails/{programmeId}',
      ondemandOttDigest: '/ondemand/ottDigest',
    };
    const region = {
      bouquetId: 1234,
      subBouquetId: 5,
      fieldTrial: null,
    };
    paths = pathFactory(endpoints, region);
  });

  it('Expect CatalogueNodePath to be correct', () => {
    assert.equal(
      paths.catalogueNodePath(),
      '/ondemand/1234/5/cataloguenode');
  });

  it('Expect CatalogueNodePath to include fieldtrial when specified', () => {
    const region = {
      bouquetId: 1234,
      subBouquetId: 5,
      fieldTrial: 6,
    };
    const paths2 = pathFactory(endpoints, region);
    assert.equal(
      paths2.catalogueNodePath(),
      '/ondemand/1234/5/cataloguenode?fieldtrial=6');
  });

  it('Expect CatalogueNodePath to include nodeid when specified', () => {
    assert.equal(
      paths.catalogueNodePath('1111122222333344444'),
      '/ondemand/1234/5/cataloguenode/1111122222333344444');
  });

  it('Expect CatalogueNodePath to include nodeid and fieldtrial when specified', () => {
    const region = {
      bouquetId: 1234,
      subBouquetId: 5,
      fieldTrial: 6,
    };
    const paths2 = pathFactory(endpoints, region);
    assert.equal(
      paths2.catalogueNodePath('1111122222333344444'),
      '/ondemand/1234/5/cataloguenode/1111122222333344444?fieldtrial=6');
  });
});
