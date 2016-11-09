import { assert } from 'chai';
import searchFactory from '../search';

import { createSearchTestServer } from '@qgo/q-go-utils-testing';

describe('When performing Searches', () => {
  let endpoints;
  let search;
  let server;
  beforeEach(() => {
    const root = 'http://localhost';
    endpoints = {
      searchSuggestions: `${root}/{clientid}/{section}/{bouquetId}/{subBouquetId}/{userid}?term={term}`,
      searchResults: `${root}/{clientid}/{section}/{bouquetId}/{subBouquetId}/{userid}/{uuidtype}/{uuid}`,
    };
    const clientId = 'skygo';
    const region = {
      bouquetId: 1234,
      subBouquetId: 5,
      fieldTrial: null,
    };
    server = createSearchTestServer();
    server.seed();
    server.start();
    search = searchFactory(clientId, endpoints, region);
  });
  afterEach(() => {
    server.stop();
  });
  it('When requesting suggestions', (done) => {
    search.getSuggestions('fishing').then((results) => {
      assert.lengthOf(
        results,
        7
      );
      assert.deepEqual(
        results[0], {
          uuid: 'sch:bbcd3319-1a88-3558-8db9-afa14991db34',
          uuidtype: 'sport',
          title: 'Fishing',
          userId: 1,
          section: 'home',
        }
      );
      done();
    }).catch(done);
  });
  it('When requesting results using a suggestion', (done) => {
    search.getSuggestions('fishing').then((suggestions) => {
      search.getResults(suggestions[0]).then((results) => {
        assert.lengthOf(
          results,
          2
        );
        done();
      }).catch(done);
    });
  });
});
