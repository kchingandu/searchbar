/*
 *
 * ImagePaths
 *
 */

// TODO: get this OUT OF HERE.
import config from '@qgo/q-go-feature-config';
import { urljoin } from '../utils.js';

const imagedefaults = {
  uuid: null,
  type: '16-9',
  width: 400,
};

const providerLogoDefaults = {
  providerName: null,
  width: 250,
  height: 250,
};

const channelLogoDefaults = {
  channelId: null,
  width: 250,
  height: 250,
};

const { endpoints } = config.get('dataservices');

const clean = (obj) => {
  const result = Object.assign({}, obj);
  for (const propName in result) { // eslint-disable-line
    if (result[propName] === null || result[propName] === undefined) {
      delete result[propName];
    }
  }
  return result;
};

const shapeProviderName = (providerName) => `${(providerName || '')
  .toLowerCase()
  .replace(/[^a-zA-Z0-9]/g, '')}`;

export const getCatalogueImagePath = (params, defaultParams = imagedefaults) => {
  const p = { ...defaultParams, ...clean(params) };
  const { image } = endpoints;
  if (!p.uuid) {
    return null;
  }
  return urljoin(
    [image, p.uuid, p.type, p.width].filter(z => z)
  );
};

export const getProviderLogoImagePath = (params, defaultParams = providerLogoDefaults) => {
  const p = { ...defaultParams, ...clean(params) };
  if (!p.providerName) {
    return null;
  }
  const { logo } = endpoints;
  return urljoin(
    [`${logo}skychb_${shapeProviderName(p.providerName)}`, p.width, p.height].filter(z => z)
  );
};

export const getChannelLogoImagePath = (params, defaultParams = channelLogoDefaults) => {
  const p = { ...defaultParams, ...params };
  const { logo } = endpoints;
  return urljoin(
    [`${logo}skychb_${p.serviceId}${shapeProviderName(p.channelName)}`, p.width, p.height].filter(z => z)
  );
};
