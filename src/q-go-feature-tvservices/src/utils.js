/*
 *
 * Service Utilities
 *
 */

// TODO: This needs to tie into resillience service.

export const jsonRequest = (url) => new Promise((resolve, reject) => {
  // console.log(`Fetching: ${url}`);  // eslint-disable-line
  fetch(url, {
    method: 'get',
  })
  .then(response => {
    // console.log(`Success: ${url}`);  // eslint-disable-line
    resolve(response.json());
  })
  .catch(e => {
    console.log(`Failed: ${url} (${e})`);  // eslint-disable-line
    reject(e);
  });
});

// pass array of objects with name and value;
export const getQueryParams = (values) => {
  if (!values || Object.keys(values).length === 0) {
    return '';
  }
  return `?${Object.keys(values)
    .filter(key => values[key])
    .map(key => `${key}=${values[key]}`)
    .join('&')}`;
};

export const normalize = (url) => {
  // make sure protocol is followed by two slashes
  let str = url.replace(/:\//g, '://');

  // remove consecutive slashes
  str = str.replace(/([^:\s])\/+/g, '$1/');

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, '$1');

  // replace ? in parameters with &
  str = str.replace(/(\?.+)\?/g, '$1&');

  return str;
};

export const urljoin = (urlparts) => normalize(
  urlparts.join('/')
);

export const replaceTokens = (value, tokens) => {
  let result = value;
  Object.keys(tokens)
    .filter(k => tokens[k])
    .forEach(key => {
      result = result.replace(new RegExp(`{${key}}`, 'gi'), tokens[key]);
    });
  return result;
};

export const replaceRegion = (url, region) => {
  const { bouquetId, subBouquetId, fieldTrial } = region;
  return replaceTokens(url, {
    bouquetId,
    subBouquetId,
  }) + (fieldTrial ? getQueryParams({
    fieldtrial: fieldTrial,
  }) : '');
};
