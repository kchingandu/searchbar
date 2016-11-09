import config from './q-go-feature-config/configs/shared';
import searchFactory from './q-go-feature-tvservices/src/search/search';

const region = config.dataservices.region;
const endpoints = config.dataservices.endpoints;
const clientId = config.dataservices.search.clientId;

const searchBot = searchFactory(clientId, endpoints, region);

export default searchBot;