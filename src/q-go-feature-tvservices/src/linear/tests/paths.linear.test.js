import linearPathFactory from '../paths';

import { assert } from 'chai';
// import { shallow } from 'enzyme';
// import React from 'react';

describe('Linear Paths', () => {
  let paths;
  let endpoints;
  beforeEach(() => {
    const root = '';
    endpoints = {
      linearServices: `${root}/linear/services/{bouquetId}/{subBouquetId}`,
      linearSchedule: `${root}/linear/schedule/{date}/{channels}`,
      linearChildEvents: `${root}/linear/schedule/childevents/{eventId}`,
    };
    const region = {
      bouquetId: 1234,
      subBouquetId: 5,
      fieldTrial: null,
    };
    paths = linearPathFactory(endpoints, region);
  });

  it('Expect LinearServicesPath to be correct', () => {
    assert.equal(
      paths.linearServicesPath(),
      '/linear/services/1234/5'
    );
  });

  it('Expect LinearServicesPath to include fieldtrial when specified', () => {
    const region = {
      bouquetId: 1234,
      subBouquetId: 5,
      fieldTrial: 6,
    };
    const paths2 = linearPathFactory(endpoints, region);
    assert.equal(
      paths2.linearServicesPath(),
      '/linear/services/1234/5?fieldtrial=6'
    );
  });

  it('Expect linearSchedulePath to include DATE and Single Channel when specified', () => {
    assert.equal(
      paths.linearSchedulePath(new Date(2033, 11 - 1, 22), 4321),
      '/linear/schedule/20331122/4321'
    );
  });

  it('Expect linearSchedulePath to include DATE and Multiple Channels when specified', () => {
    assert.equal(
      paths.linearSchedulePath(new Date(2033, 11 - 1, 22), [4321, 7654, 1234]),
      '/linear/schedule/20331122/4321,7654,1234'
    );
  });

  it('Expect linearSchedulePath to only return first 20 if more than 20 channels are specified', () => {
    const channels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    assert.deepEqual(
      paths.linearSchedulePath(new Date(2033, 11 - 1, 22), channels),
      '/linear/schedule/20331122/1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20'
    );
  });

  it('Expect linearChildEventsPath to include EVENTID', () => {
    assert.equal(
      paths.linearChildEventsPath('E7d2-f5f1'),
      '/linear/schedule/childevents/E7d2-f5f1'
    );
  });
});
