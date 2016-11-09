import {
  getQueryParams,
  replaceTokens,
} from '../utils';
import { assert } from 'chai';

describe('Query Param tests', () => {
  it('Expect Query Params call with no values to be empty string', () => {
    assert.equal(
      getQueryParams(),
      ''
    );
  });
  it('Expect Query Params call with empty object to be empty string', () => {
    assert.equal(
      getQueryParams({}),
      ''
    );
  });
  it('Expect Query Params call with single item to return a queryparam', () => {
    assert.equal(
      getQueryParams({
        test: 123,
      }),
      '?test=123');
  });
  it('Expect Query Params call with multiple item to return a joined queryparam', () => {
    assert.equal(
      getQueryParams({
        test: 123,
        test2: 789,
      }),
      '?test=123&test2=789');
  });
});

describe('Token Replacing', () => {
  it('Can Replace a simple token', () => {
    const testText = 'http://hello/{token1}/xyz';
    assert.equal(
      replaceTokens(testText, {
        token1: 1234,
      }),
      'http://hello/1234/xyz'
    );
  });
  it('Token CaSe is ignored', () => {
    const testText = 'http://hello/{ToKeN1}/xyz';
    assert.equal(
      replaceTokens(testText, {
        token1: 1234,
      }),
      'http://hello/1234/xyz'
    );
  });
  it('Multiple Instances of the token are replaced', () => {
    const testText = 'http://hello/{token1}/xyz/{token1}';
    assert.equal(
      replaceTokens(testText, {
        token1: 1234,
      }),
      'http://hello/1234/xyz/1234'
    );
  });
});
