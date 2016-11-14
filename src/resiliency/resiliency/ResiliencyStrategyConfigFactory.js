class ResiliencyStrategyConfigsFactory {
  constructor() {
    this.createConfigMap();
  }

  createConfigMap() {
    this.configMap = {
      [CHEAP]: {
        retries: 1,
        backoffInterval: 30000,
        timeoutIntervals: [4000, 5000],
      },
      [EXPENSIVE]: {
        retries: 1,
        backoffInterval: 30000,
        timeoutIntervals: [8000, 10000],
      },
    };
  }

  createConfig(type) {
    const config = this.configMap[type];
    return Object.create(config);
  }

  overWriteConfigMap(newConfigMap) {
    this.configMap[CHEAP] = newConfigMap[CHEAP] ? newConfigMap[CHEAP] : this.configMap[CHEAP];
    this.configMap[EXPENSIVE] = newConfigMap[EXPENSIVE] ? newConfigMap[EXPENSIVE] : this.configMap[EXPENSIVE];
  }
}

const CHEAP = ResiliencyStrategyConfigsFactory.CHEAP = 'cheap';

const EXPENSIVE = ResiliencyStrategyConfigsFactory.EXPENSIVE = 'expensive';

export const configTypes = { CHEAP, EXPENSIVE };

export const resiliencyStrategyConfigFactory = new ResiliencyStrategyConfigsFactory();
