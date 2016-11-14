import { assert } from 'chai';
import sinon from 'sinon';
import BaseHttpRequest from './BaseHttpRequest';
let baseHttpRequest;

let eventHandlersStub;
let requestConfigStub;
let xmlHttpRequestStub;

describe('BaseHttpRequest', () => {
  describe('Instantiation', () => {
    it('should configure the xmlHttpRequest with properties from the URLRequestConfig', () => {
      assert.equal(baseHttpRequest.xmlHttpRequest.timeout, requestConfigStub.getTimeoutInterval());
      assert.equal(baseHttpRequest.xmlHttpRequest.withCredentials, requestConfigStub.getWithCredentials());
    });

    it('should, on instantiation, configure the xmlHttpRequest with the eventHandlers methods', () => {
      assert.equal(baseHttpRequest.xmlHttpRequest.onerror, eventHandlersStub.onError);
      assert.equal(baseHttpRequest.xmlHttpRequest.onload, eventHandlersStub.onSuccess);
      assert.equal(baseHttpRequest.xmlHttpRequest.ontimeout, eventHandlersStub.onError);
    });
  });

  describe('Sending a request', () => {
    it('should call the open function with the correct method and url derived from the URLRequestConfig', () => {
      const url = requestConfigStub.getUrl();
      const method = requestConfigStub.getMethod();

      baseHttpRequest.send();

      assert.isTrue(baseHttpRequest.xmlHttpRequest.open.calledWithExactly(method, url));
    });


    it('should call the setHeaders function if headers are available', () => {
      const setRequestHeaderSpy = baseHttpRequest.xmlHttpRequest.setRequestHeader;

      requestConfigStub.getHeaders.returns({ key1: 'value1', key2: 'value2' });

      baseHttpRequest.send();

      assert.isTrue(setRequestHeaderSpy.getCall(0).calledWithExactly('key1', 'value1'));
      assert.isTrue(setRequestHeaderSpy.getCall(1).calledWithExactly('key2', 'value2'));
    });

    it('should not call the setHeaders function when no headers are available', () => {
      const setRequestHeaderSpy = baseHttpRequest.xmlHttpRequest.setRequestHeader;

      requestConfigStub.getHeaders.returns(undefined);

      baseHttpRequest.send();

      assert.isFalse(setRequestHeaderSpy.called);
    });

    it('should call the xmlHttpRequest send function with post body value derived from the URLRequestConfig', () => {
      const sendSpy = baseHttpRequest.xmlHttpRequest.send;

      requestConfigStub.getPostBody.returns('key=value&key=value');

      baseHttpRequest.send();

      assert.isTrue(sendSpy.calledWithExactly('key=value&key=value'));
    });

    it('should first call open then set headers in order when making a request', () => {
      const openSpy = baseHttpRequest.xmlHttpRequest.open;
      const setHeadersSpy = baseHttpRequest.xmlHttpRequest.setRequestHeader;
      const sendSpy = baseHttpRequest.xmlHttpRequest.send;

      requestConfigStub.getHeaders.returns({ key1: 'value1', key2: 'value2' });

      baseHttpRequest.send();

      assert.isTrue(sendSpy.calledAfter(setHeadersSpy));
      assert.isTrue(setHeadersSpy.calledAfter(openSpy));
    });
  });

  beforeEach(() => {
    createEventHandlerStub();
    createRequestConfigStub();
    createXmlHttpRequestStub();
    createBaseHttpRequest();
  });

  function createBaseHttpRequest() {
    baseHttpRequest = new BaseHttpRequest(requestConfigStub, eventHandlersStub, xmlHttpRequestStub);
  }

  function createXmlHttpRequestStub() {
    xmlHttpRequestStub = sinon.stub({
      send: Function.prototype,
      open: Function.prototype,
      setRequestHeader: Function.prototype,
    });
  }

  function createEventHandlerStub() {
    eventHandlersStub = sinon.stub({
      onError: Function.prototype,
      onSuccess: Function.prototype,
    });
  }

  function createRequestConfigStub() {
    requestConfigStub = sinon.stub({
      getUrl: Function.prototype,
      getMethod: Function.prototype,
      getHeaders: Function.prototype,
      getPostBody: Function.prototype,
      getTimeoutInterval: Function.prototype,
      getWithCredentials: Function.prototype,
    });

    requestConfigStub.getMethod.returns('GET');
    requestConfigStub.getTimeoutInterval.returns(3000);
    requestConfigStub.getWithCredentials.returns(false);
    requestConfigStub.getUrl.returns('http://test.com');
  }
});
