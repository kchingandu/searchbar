/*
 *
 * Linear Adapters
 *
 */
import * as map from '../datamap/index';

import {
  getChannelLogoImagePath,
} from '../images/paths';

import {
  synopsisAdapter,
  certificateAdapter,
  durationAdapter,
} from '../adapters.common';

export const sortAdapter = (title, index = 0) => {
  if (!title) {
    return '';
  }
  if (index >= title.length) {
    return title;
  }
  if (index > 0) {
    return title.substring(index);
  }
  return title;
};

export const channelAdapter = map.create({
  sid: map.to('serviceId'),
  c: map.to('channel'),
  t: map.to('channelName'),
  sg: map.to('serviceGenreId'),
  xsg: map.to('extraServiceGenreId'),
  sf: map.to('serviceFormat'),
  adult: map.to('adult'),
  local: map.to('local'),
  avail: map.to('avail'),
}, (item) => ({
  getLogoUrl: (width, height) => getChannelLogoImagePath({
    serviceId: item.sid,
    channelName: item.t,
    width,
    height,
  }),
}));

export const servicesAdapter = map.create({
  services: map.to('channels').with(channelAdapter),
});

export const eventAdapter = map.create({
  programmeuuid: map.to('id').optional,
  t: map.to('title'),
  tso: map.required,
  sy: map.to('synopsis').with(synopsisAdapter),
  eid: map.to('eventId'),
  st: map.to('startsAt').epoch,
  d: map.to('duration').with(durationAdapter),
  cgid: map.to('channelGroupId'),
  seasonnumber: map.to('seasonNumber').optional,
  episodenumber: map.to('episodeNumber').optional,
  seasonuuid: map.to('seasonId').optional,
  seriesuuid: map.to('seriesId').optional,
  haschildren: map.to('hasChildren').bool,
  eg: map.to('genreId'),
  esg: map.to('subGenreId'),
  r: map.to('certificate').with(certificateAdapter),
  at: map.to('audioType'),
  s: map.to('hasSubtitles').bool,
  ad: map.to('hasAudioDescription').bool,
  hd: map.to('isHD').bool,
  new: map.to('isNew').bool,
  canl: map.to('canSeriesLink').bool,
  canb: map.to('canBeRemoteRecorded').bool,
  slo: map.to('canBeSideLoaded').bool,
  w: map.to('isWideScreen'),
  marketingmessage: map.to('marketingMessage').optional,
  oppv: map.to('isOPPV').bool,
  ippv: map.to('isIPPV').bool,
}, (data) => ({
  sort: sortAdapter(data.t, data.tso),
}));

const scheduleItemAdapter = map.create({
  sid: map.to('serviceId'),
  events: map.to('events').with(eventAdapter),
});

export const schedulesAdapter = map.create({
  date: map.to('date').date,
  schedule: map.to('schedule').with(scheduleItemAdapter),
}, (data) => ({
  channels: data.schedule.map(i => i.sid),
}));
