import statusCodes from '../constants/status-codes';

class ResiliencyStrategy {
  constructor(config = {}) {
    this.config = config;
    this.currentAttempt = 0;
    this.currentBackoffInterval = 0;
    this.backOffStatusCodeRegex = new RegExp(`(${statusCodes.TOO_MANY_REQUESTS}|${statusCodes.REQUEST_TIMEOUT}|5\\d{2})`);
  }

  validateResponse(response) {
    if (this.isSuccessStatusCode(response.target.status)) {
      this.onResolve(response);
    } else {
      this.handleErrorResponse(response);
    }
  }

  handleErrorResponse(response) {
    if (this.hasAttemptsRemaining()) {
      this.currentBackoffInterval = this.setBackoffInterval(response.status);
      this.prepareRetry();
    } else {
      this.onReject(response);
    }
  }

  hasAttemptsRemaining() {
    return Boolean(this.currentAttempt < this.config.retries);
  }

  setBackoffInterval(statusCode) {
    return this.doesStatusCodeWarrantBackingOff(statusCode) || statusCode === undefined ? this.config.backoffInterval : 0;
  }

  doesStatusCodeWarrantBackingOff(statusCode) {
    return Boolean(this.backOffStatusCodeRegex.test(String(statusCode)));
  }

  prepareRetry() {
    this.currentAttempt++;

    const timeoutHandler = () => {
      this.onRetry();
    };

    setTimeout(timeoutHandler, this.currentBackoffInterval);
  }

  getTimeoutInterval() {
    return this.config.timeoutIntervals[this.currentAttempt];
  }

  isSuccessStatusCode(statusCode) {
    return (statusCode >= statusCodes.OK && statusCode < statusCodes.MULTIPLE_CHOICES)
      || statusCode === statusCodes.MOVED_TEMPORARILY
      || statusCode === statusCodes.NOT_MODIFIED
      || statusCode === statusCodes.NO_CONTENT_IE;
  }

  setOnRetry(callback) {
    this.onRetry = callback;
  }

  setOnResolve(callback) {
    this.onResolve = callback;
  }

  setOnReject(callback) {
    this.onReject = callback;
  }

}

export default ResiliencyStrategy;

