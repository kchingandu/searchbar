import { assert } from 'chai';
import sinon from 'sinon';
import * as httpRequestModuleExports from './httpRequest';
import resilientHttpRequest from './resilientHttpRequest';

let httpRequest;
let httpRequestStub;

describe('resilientHttpRequest', () => {
  it('should return a promise object when invoked', () => {
    assert.instanceOf(resilientHttpRequest(), Promise);
  });

  describe('Invocation', () => {
    const options = {};
    let resilientStrategyStub;
    const TIME_OUT_INTERVAL = 3000;
    const URL = 'http://www.test.com';

    it('should set the resiliencyStrategy OnReject, onResolve and onRetry methods', () => {
      resilientHttpRequest(URL, options, resilientStrategyStub);

      assert.instanceOf(resilientStrategyStub.setOnRetry.args[0][0], Function);
      assert.instanceOf(resilientStrategyStub.setOnReject.args[0][0], Function);
      assert.instanceOf(resilientStrategyStub.setOnResolve.args[0][0], Function);
    });

    it('should set the timeout property on the options parameter passed to the httpRequest', () => {
      resilientHttpRequest(URL, options, resilientStrategyStub);
      assert.equal(httpRequestStub.args[0][1].timeout, TIME_OUT_INTERVAL);
    });

    it('should call the httpRequest with the url and options parameters', () => {
      resilientHttpRequest(URL, options, resilientStrategyStub);
      assert.isTrue(httpRequestStub.calledWithExactly(URL, { timeout: TIME_OUT_INTERVAL }));
    });

    it('should handle the httpRequest promise onResolve and onReject callbacks with the same handler. ' +
      'The handler in turn delegates the response to the resiliencyStrategy for validation', () => {
      resilientHttpRequest(URL, options, resilientStrategyStub);

      const onReject = httpRequestStub().then.args[0][1];
      const onResolve = httpRequestStub().then.args[0][0];

      assert.typeOf(onReject, 'function');
      assert.typeOf(onResolve, 'function');
      assert.deepEqual(onResolve, onResolve);
    });

    beforeEach(() => {
      resilientStrategyStub = sinon.stub({
        setOnRetry: Function.prototype,
        setOnReject: Function.prototype,
        setOnResolve: Function.prototype,
        validateResponse: Function.prototype,
        getTimeoutInterval: Function.prototype,
      });

      resilientStrategyStub.getTimeoutInterval.returns(TIME_OUT_INTERVAL);
    });
  });

  beforeEach(() => {
    createHttpRequestStub();
  });

  afterEach(() => {
    restoreBaseHttpRequest();
  });

  function createHttpRequestStub() {
    httpRequest = httpRequestModuleExports.default;
    httpRequestModuleExports.default = httpRequestStub = sinon.stub();
    httpRequestStub.returns(sinon.stub({ then: Function.prototype }));
  }

  function restoreBaseHttpRequest() {
    httpRequestModuleExports.default = httpRequest;
  }
});
