import URLRequestConfig from './URLRequestConfig';
import BaseHttpRequest from './BaseHttpRequest';

export default function (url, options = {}) {
  return new Promise((onSuccess, onError) => {
    const extendedOptions = Object.assign({ url }, options);

    const endPointConfig = new URLRequestConfig(extendedOptions);

    const request = new BaseHttpRequest(endPointConfig, { onSuccess, onError });

    request.send();
  });
}
