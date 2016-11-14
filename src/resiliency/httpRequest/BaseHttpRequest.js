class BaseHttpRequest {
  constructor(urlRequestConfig, eventHandlers, xmlHttpRequest = new XMLHttpRequest()) {
    this.eventHandlers = eventHandlers;
    this.urlRequestConfig = urlRequestConfig;
    this.configureXmlHttpRequest(xmlHttpRequest);
  }

  configureXmlHttpRequest(xmlHttpRequest) {
    this.xmlHttpRequest = xmlHttpRequest;
    this.xmlHttpRequest.onerror = this.eventHandlers.onError;
    this.xmlHttpRequest.onload = this.eventHandlers.onSuccess;
    this.xmlHttpRequest.ontimeout = this.eventHandlers.onError;
    this.xmlHttpRequest.timeout = this.urlRequestConfig.getTimeoutInterval();
    this.xmlHttpRequest.withCredentials = this.urlRequestConfig.getWithCredentials();
  }

  send() {
    this.xmlHttpRequest.open(this.urlRequestConfig.getMethod(), this.urlRequestConfig.getUrl());
    this.setHeaders();
    this.xmlHttpRequest.send(this.urlRequestConfig.getPostBody());
  }

  setHeaders() {
    const headers = this.urlRequestConfig.getHeaders();

    if (headers) {
      Object.keys(headers).forEach((headerName) => {
        this.xmlHttpRequest.setRequestHeader(headerName, headers[headerName]);
      });
    }
  }
}

export default BaseHttpRequest;
