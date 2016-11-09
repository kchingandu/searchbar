import {
  replaceRegion,
  replaceTokens,
} from '../utils';
import moment from 'moment';

const pathFactory = (endpoints, region) => {
  const replace = (url, tokens) => replaceRegion(replaceTokens(url, tokens), region);
  return {
    linearServicesPath() {
      const { linearServices } = endpoints;
      return replace(linearServices, {});
    },
    linearSchedulePath(date, channels) {
      const { linearSchedule } = endpoints;
      let channelsText = '';
      let channels2 = channels;
      if (typeof channels === 'number') {
        channels2 = [channels];
      } else if (typeof channels === 'string') {
        channels2 = channels.split(',');
      }
      channelsText = channels2.slice(0, 20).join(',');
      return replace(linearSchedule, {
        date: moment(date).format('YYYYMMDD'),
        channels: channelsText,
      });
    },
    linearChildEventsPath(eventId) {
      const { linearChildEvents } = endpoints;
      return replace(linearChildEvents, {
        eventId,
      });
    },
  };
};

export default pathFactory;
