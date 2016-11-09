/*
 *
 * Linear TV Services
 *
 */

import {
  jsonRequest,
} from '../utils';
import * as adapters from './adapters';
import pathFactory from './paths';
import * as map from '../datamap/index';

const linearFactory = (endpoints, region) => {
  const paths = pathFactory(endpoints, region);
  return {
    getChannels() {
      return jsonRequest(paths.linearServicesPath()).then(result => {
        const { channels } = map.run(result, adapters.servicesAdapter);
        return channels;
      });
    },
    getProgrammes(date, channels) {
      return jsonRequest(paths.linearSchedulePath(date, channels)).then(result =>
        map.run(result, adapters.schedulesAdapter)
      );
    },
    getChildEvents(eventId) {
      // TODO: Mapping adapters
      return jsonRequest(paths.linearChildEventsPath(eventId));
    },
  };
};

export default linearFactory;
