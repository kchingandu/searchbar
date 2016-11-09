import config from '@qgo/q-go-feature-config';

import ondemandFactory from './ondemand/ondemand';
import linearFactory from './linear/linear';
import searchFactory from './search/search';

const settings = config.get('dataservices');

const {
  endpoints,
  region,
  menu,
  search: searchSettings,
} = settings;

const ondemand = ondemandFactory(endpoints, region, menu);
const linear = linearFactory(endpoints, region);
const search = searchFactory(searchSettings.clientId, endpoints, region);

export {
  ondemand,
  linear,
  search,
};
