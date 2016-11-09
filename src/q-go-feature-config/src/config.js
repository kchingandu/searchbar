import merge from 'deepmerge';

import shared from '../configs/shared.js';
import development from '../configs/dev.js';
import test from '../configs/test.js';
import production from '../configs/prod.js';

const embeddedData = {
  shared,
  development,
  test,
  production,
};

const getEnv = () => process.env.NODE_ENV;

const mergeConfig = (configData, env) => merge(Object.assign({},
    configData.shared || {}),
    configData[env] || {});

export const configFactory = (configdata, env) => {
  const data = mergeConfig(configdata, env);
  return {
    load(/* endpoint */) {
      // TODO: Grab the data from the config service.
      // TODO: Merge with any local data.
      // Store it.
    },
    get(name) {
      return data[name] || null;
    },
  };
};

export default configFactory(embeddedData, getEnv());
