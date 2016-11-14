import URLRequestConfig from './URLRequestConfig';
import { assert } from 'chai';

describe('urlRequestConfig', () => {
  it('should return default properties when instantiated without a configuration object', () => {
    const urlRequestConfig = new URLRequestConfig();

    assert.equal(urlRequestConfig.getUrl(), '');
    assert.equal(urlRequestConfig.getMethod(), 'GET');
    assert.equal(urlRequestConfig.getTimeoutInterval(), 4000);
  });

  it('should return the properties of the object parameters used on instantiated', () => {
    const config = { url: 'www.test.com', timeout: 1000, method: 'POST' };
    const urlRequestConfig = new URLRequestConfig(config);

    assert.equal(urlRequestConfig.getUrl(), config.url);
    assert.equal(urlRequestConfig.getMethod(), config.method);
    assert.equal(urlRequestConfig.getTimeoutInterval(), config.timeout);
  });
});
