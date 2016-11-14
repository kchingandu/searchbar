import { assert } from 'chai';
import sinon from 'sinon';
import ResilienceStrategy from './ResiliencyStrategy';

const RETRIES = 1;
let setTimeoutMock;
let resilienceStrategy;
const BACK_OFF_INTERVAL = 30000;

describe('ResilienceStrategy', () => {
  describe('successful response status codes', () => {
    it('should call resolve on an http status code between 200 and 299', () => {
      assetOnResolveIsCalledWithResponse(200);
    });

    it('should call resolve on a 302 http request status code', () => {
      assetOnResolveIsCalledWithResponse(302);
    });
    it('should call resolve on a 304 http request status code', () => {
      assetOnResolveIsCalledWithResponse(304);
    });

    it('should call resolve on a 1223 http request status code', () => {
      assetOnResolveIsCalledWithResponse(1223);
    });

    function assetOnResolveIsCalledWithResponse(statusCode) {
      const response = { target: { status: statusCode } };

      resilienceStrategy.validateResponse(response);

      assert.isTrue(resilienceStrategy.onResolve.calledWith(response));
    }
  });

  describe('status codes that set the resiliency backing off interval', () => {
    it('should, when presented with the status code that represent \'too may requests\' (429), delay calling retry', () => {
      assertThatBackOffIntervalIsSetAndRetryIsCalledAfterDelay(429);
    });

    it('should, when presented with the status code that represent \'request time out\' (408), delay calling retry', () => {
      assertThatBackOffIntervalIsSetAndRetryIsCalledAfterDelay(408);
    });

    it('should, when presented with the status code that represent \'internal server error\' (500), delay calling retry', () => {
      assertThatBackOffIntervalIsSetAndRetryIsCalledAfterDelay(500);
    });

    function assertThatBackOffIntervalIsSetAndRetryIsCalledAfterDelay(statusCode) {
      const response = { target: { status: statusCode } };

      resilienceStrategy.validateResponse(response);

      assert.equal(resilienceStrategy.currentBackoffInterval, BACK_OFF_INTERVAL);

      assert.isFalse(resilienceStrategy.onRetry.called);

      setTimeoutMock.tick(BACK_OFF_INTERVAL);

      assert.isTrue(resilienceStrategy.onRetry.called);
    }

    beforeEach(() => {
      setTimeoutMock = sinon.useFakeTimers();
    });
    afterEach(() => {
      setTimeoutMock.restore();
    });
  });

  describe('Managing retries', () => {
    it('should call reject after the configured number of retries are exceeded', () => {
      createResilienceStrategy({ retries: 3, backoffInterval: 0 });

      resilienceStrategy.validateResponse({ target: { status: 1 } });
      setTimeoutMock.tick(0);

      resilienceStrategy.validateResponse({ target: { status: 1 } });
      setTimeoutMock.tick(0);

      resilienceStrategy.validateResponse({ target: { status: 1 } });
      setTimeoutMock.tick(0);

      resilienceStrategy.validateResponse({ target: { status: 1 } });
      setTimeoutMock.tick(0);

      assert.isTrue(resilienceStrategy.onRetry.calledThrice);
      assert.isTrue(resilienceStrategy.onReject.calledOnce);
    });

    beforeEach(() => {
      setTimeoutMock = sinon.useFakeTimers();
    });
    afterEach(() => {
      setTimeoutMock.restore();
    });
  });

  beforeEach(() => {
    createResilienceStrategy({
      retries: RETRIES,
      backoffInterval: BACK_OFF_INTERVAL,
    });
  });

  function createResilienceStrategy(config) {
    resilienceStrategy = new ResilienceStrategy(config);

    resilienceStrategy.setOnRetry(sinon.spy());
    resilienceStrategy.setOnReject(sinon.spy());
    resilienceStrategy.setOnResolve(sinon.spy());
  }
});
