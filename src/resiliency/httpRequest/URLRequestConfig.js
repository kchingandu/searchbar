class URLRequestConfig {
  constructor(baseConfig = {}) {
    this.baseConfig = baseConfig;
  }

  getMethod() {
    return this.baseConfig.method || 'GET';
  }

  getTimeoutInterval() {
    return this.baseConfig.timeout || 4000;
  }

  getWithCredentials() {
    return Boolean(this.baseConfig.withCredentials);
  }

  getUrl() {
    return this.baseConfig.url || '';
  }

  getPostBody() {
    return this.baseConfig.postBody;
  }

  getHeaders() {
    return this.baseConfig.headers;
  }
}

export default URLRequestConfig;
