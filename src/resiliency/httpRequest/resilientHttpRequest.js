import httpRequest from './httpRequest';

function resilientURLRequest(url, options = {}, resiliencyStrategy) {
  return new Promise((resolve, reject) => {
    resiliencyStrategy.setOnRetry(send);
    resiliencyStrategy.setOnReject(reject);
    resiliencyStrategy.setOnResolve(resolve);
    send();
  });

  function send() {
    const httpResponseHandler = (response) => resiliencyStrategy.validateResponse(response);

    const timeout = resiliencyStrategy.getTimeoutInterval();

    const extendedOptions = Object.assign({ timeout }, options);

    httpRequest(url, extendedOptions).then(httpResponseHandler, httpResponseHandler);
  }
}

export default resilientURLRequest;
