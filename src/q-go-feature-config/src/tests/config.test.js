import dev from '../../configs/dev';
import prod from '../../configs/prod';
import shared from '../../configs/shared';
import test from '../../configs/test';

import { configFactory } from '../config';

import { assert } from 'chai';

describe('Config System Testing', () => {
  it('DEV config returns an object', () => {
    assert.isObject(dev);
  });
  it('PROD config returns an object', () => {
    assert.isObject(prod);
  });
  it('SHARED config returns an object', () => {
    assert.isObject(shared);
  });
  it('TEST config returns an object', () => {
    assert.isObject(test);
  });

  it('can grab requested data node from a simple config', () => {
    const testdata = {
      shared: {
        testnode: {
          value: 'Hello!',
        },
      },
      unittest: {
      },
    };
    const config = configFactory(testdata, 'unittest');
    const result = config.get('testnode');
    assert.deepEqual(
      result,
      {
        value: 'Hello!',
      }
    );
  });

  it('can grab requested data node from a merged config', () => {
    const testdata = {
      shared: {
        testnode: {
          value: 'Hello',
        },
      },
      unittest: {
        testnode: {
          value: 'World',
        },
      },
    };
    const config = configFactory(testdata, 'unittest');
    const result = config.get('testnode');
    assert.deepEqual(
      result,
      {
        value: 'World',
      }
    );
  });

  it('configuration is deep merged', () => {
    const testdata = {
      shared: {
        testnode: {
          value: 'Hello',
          anothervalue: 'notoverriden',
        },
      },
      unittest: {
        testnode: {
          value: 'World',
        },
      },
    };
    const config = configFactory(testdata, 'unittest');
    const result = config.get('testnode');
    assert.deepEqual(
      result,
      {
        value: 'World',
        anothervalue: 'notoverriden',
      }
    );
  });

  it('if node_env doesnt exist, configuration returns shared data', () => {
    const testdata = {
      shared: {
        testnode: {
          value: 'Hello World',
        },
      },
    };
    const config = configFactory(testdata, 'unittest');
    const result = config.get('testnode');
    assert.deepEqual(
      result,
      {
        value: 'Hello World',
      }
    );
  });

  it('if node_env exists, and shares exists, but node doesnt then null is returned', () => {
    const testdata = {
      shared: {
        unknown: {
          value: 'Hello World',
        },
      },
    };
    const config = configFactory(testdata, 'unittest');
    const result = config.get('other');
    assert.deepEqual(
      result,
      null,
    );
  });

  it('if shared doesnt exist, configuration returns overriden data', () => {
    const testdata = {
      unittest: {
        testnode: {
          value: 'Hello World',
        },
      },
    };
    const config = configFactory(testdata, 'unittest');
    const result = config.get('testnode');
    assert.deepEqual(
      result,
      {
        value: 'Hello World',
      }
    );
  });

  it('if shared, or env doesnt exist, configuration returns null', () => {
    const testdata = {};
    const config = configFactory(testdata, 'unittest');
    const result = config.get('testnode');
    assert.deepEqual(
      result,
      null,
    );
  });
});
