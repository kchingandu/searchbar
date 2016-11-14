import { assert } from 'chai';
import { resiliencyStrategyConfigFactory } from './ResiliencyStrategyConfigFactory';

const CHEAP = 'cheap';
const EXPENSIVE = 'expensive';

describe('ResilienceStrategyConfigFactory', () => {
  it('should have a default value for a cheap configuration', () => {
    assetConfigIsCheap(
            resiliencyStrategyConfigFactory.createConfig(CHEAP)
        );
  });

  it('should have a default value for a expensive configuration', () => {
    assetConfigIsExpensive(
            resiliencyStrategyConfigFactory.createConfig(EXPENSIVE)
        );
  });

  it('should over write the default CHEAP config with that contained in a new config object', () => {
    const newConfigMap = { [CHEAP]: createNewConfig() };

    resiliencyStrategyConfigFactory.overWriteConfigMap(newConfigMap);

    assert.deepEqual(newConfigMap[CHEAP], resiliencyStrategyConfigFactory.createConfig(CHEAP));

    assetConfigIsExpensive(
            resiliencyStrategyConfigFactory.createConfig(EXPENSIVE)
        );
  });

  it('should over write the default EXPENSIVE config with that contained in a new config object', () => {
    const newConfigMap = { [EXPENSIVE]: createNewConfig() };

    resiliencyStrategyConfigFactory.overWriteConfigMap(newConfigMap);

    assert.deepEqual(newConfigMap[EXPENSIVE], resiliencyStrategyConfigFactory.createConfig(EXPENSIVE));

    assetConfigIsCheap(
            resiliencyStrategyConfigFactory.createConfig(CHEAP)
        );
  });

  function assetConfigIsExpensive(expensiveConfig) {
    assert.equal(expensiveConfig.retries, 1);
    assert.equal(expensiveConfig.backoffInterval, 30000);
    assert.deepEqual(expensiveConfig.timeoutIntervals, [8000, 10000]);
  }

  function assetConfigIsCheap(cheapConfig) {
    assert.equal(cheapConfig.retries, 1);
    assert.equal(cheapConfig.backoffInterval, 30000);
    assert.deepEqual(cheapConfig.timeoutIntervals, [4000, 5000]);
  }

  function createNewConfig() {
    return {
      retries: 2,
      backoffInterval: 60000,
      timeoutIntervals: [1000, 2000],
    };
  }

  beforeEach(() => {
    resiliencyStrategyConfigFactory.createConfigMap();
  });
});
