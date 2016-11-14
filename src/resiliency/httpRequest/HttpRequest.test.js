import { assert } from 'chai';
import sinon from 'sinon';
import * as BaseHttpRequestModuleExports from './BaseHttpRequest';
import * as URLRequestConfigModuleExports from './URLRequestConfig';
import httpRequest from './httpRequest';

let BaseHttpRequest;
let URLRequestConfig;
let BaseHttpRequestStub;
let URLRequestConfigStub;

describe('HttpRequest', () => {
  it('should return a promise object when invoked', () => {
    assert.instanceOf(httpRequest(), Promise);
  });

  describe('Instantiation', () => {
    const options = {};
    const URL = 'http://www.test.com';

    it('should create a new options object that extends the argument options object with addition of the url property',
      () => {
        httpRequest(URL, options);

        assert.equal(URLRequestConfigStub.args[0][0].url, URL);
      });

    it('should instantiate the URLRequestConfiguration constructor passing in a new options object', () => {
      httpRequest(URL, options);

      assert.isTrue(URLRequestConfigStub.calledWithExactly({ url: URL }));
    });

    it('should instantiate the BaseHttpRequest constructor passing an instance of the URLRequestConfiguration ' +
      'and an object (eventHandler) containing the promise resolve and reject methods', () => {
      httpRequest(URL, options);

      const eventHandler = BaseHttpRequestStub.args[0][1];
      const requestConfig = BaseHttpRequestStub.args[0][0];

      assert.instanceOf(requestConfig, Object);
      assert.instanceOf(eventHandler.onError, Function);
      assert.instanceOf(eventHandler.onSuccess, Function);
    });
  });

  beforeEach(() => {
    createBaseHttpRequestStub();
    createURLRequestConfigStub();
  });

  afterEach(() => {
    restoreBaseHttpRequest();
    restoreURLRequestConfig();
  });

  function createBaseHttpRequestStub() {
    BaseHttpRequest = BaseHttpRequestModuleExports.default;
    BaseHttpRequestModuleExports.default = BaseHttpRequestStub = sinon.stub();
  }

  function createURLRequestConfigStub() {
    URLRequestConfig = URLRequestConfigModuleExports.default;
    URLRequestConfigModuleExports.default = URLRequestConfigStub = sinon.stub();
  }

  function restoreURLRequestConfig() {
    URLRequestConfigModuleExports.default = URLRequestConfig;
  }

  function restoreBaseHttpRequest() {
    BaseHttpRequestModuleExports.default = BaseHttpRequest;
  }
});
