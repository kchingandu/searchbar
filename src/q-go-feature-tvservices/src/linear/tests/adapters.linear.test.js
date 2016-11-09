import { assert } from 'chai';
import moment from 'moment';

import {
  linearServices,
  singleChannel,
  multiChannel,
  channelEvent,
} from '@qgo/q-go-utils-testing';

import * as map from '../../datamap/index';
import * as adapters from '../adapters';

describe('Linear Adapter Testing', () => {
  describe('When mapping Data through Channels Adapter', () => {
    let data;
    beforeEach(() => {
      const { channels } = map.run(linearServices, adapters.servicesAdapter);
      data = channels;
    });
    it('data should be an array', () => {
      assert.isArray(
        data
      );
    });
    it('check first channel structure is correct', () => {
      const { getLogoUrl, ...channel } = data[0]; // eslint-disable-line
      assert.deepEqual(
        channel,
        {
          serviceId: 2002,
          channel: 101,
          channelName: 'BBC One Lon',
          serviceGenreId: 3,
          extraServiceGenreId: 4,
          serviceFormat: 'SD',
          adult: false,
          local: true,
          avail: [
            'BROADCAST',
          ],
        }
      );
    });
  });

  describe('When mapping Data through a Channel Adapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(linearServices.services[0], adapters.channelAdapter);
    });
    it('the SID (Service Id) should be correct', () => {
      assert.equal(
        data.serviceId,
        '2002'
      );
    });
    it('the Channel Number should be correct', () => {
      assert.equal(
        data.channel,
        '101'
      );
    });
    it('the Channel Name should be correct', () => {
      assert.equal(
        data.channelName,
        'BBC One Lon'
      );
    });
    it('the Service Genre ID should be correct', () => {
      assert.equal(
        data.serviceGenreId,
        3
      );
    });
    it('the Extra Service Genre ID should be correct', () => {
      assert.equal(
        data.extraServiceGenreId,
        4
      );
    });
    it('the Service Format should be correct', () => {
      assert.equal(
        data.serviceFormat,
        'SD'
      );
    });
    it('the ADULT flag should be correct', () => {
      assert.equal(
        data.adult,
        false
      );
    });
    it('the LOCAL flag should be correct', () => {
      assert.equal(
        data.local,
        true
      );
    });
    it('the AVAILABILITIES should be correct', () => {
      assert.deepEqual(
        data.avail,
        ['BROADCAST']
      );
    });
    it('the CHANNEL LOGO url is correct', () => {
      assert.equal(
        data.getLogoUrl(100, 250),
        'http://images.metadata.sky.com/pd-logo/skychb_2002bbconelon/100/250'
      );
    });
  });
  describe('When mapping Single Channel Data call through a Schedules Adapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(singleChannel, adapters.schedulesAdapter);
    });
    it('the DATE should be a moment and be correct', () => {
      assert.isTrue(
        moment.isMoment(data.date)
      );
      assert.isTrue(
        data.date.isSame(moment('2016-10-28'))
      );
    });
    it('the CHANNELS is mapped to a convinient array', () => {
      assert.deepEqual(
        data.channels,
        [2002]
      );
    });
    it('the SCHEDULE for the channel is mapped', () => {
      assert.lengthOf(
        data.schedule,
        1
      );
    });
    it('the EVENTS for the channel are mapped', () => {
      assert.lengthOf(
        data.schedule[0].events,
        31
      );
    });
  });
  describe('When mapping Multi Channel Data call through a Schedules Adapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(multiChannel, adapters.schedulesAdapter);
    });
    it('the CHANNELS are mapped to a convinient array', () => {
      assert.deepEqual(
        data.channels,
        [2002, 2003, 2004, 2005]
      );
    });
    it('the SCHEDULE for each channel are mapped', () => {
      assert.lengthOf(
        data.schedule,
        4
      );
    });
  });
  describe('When passing a title to the sortAdapter', () => {
    it('Title returned if index is undefined', () => {
      const title = 'Test Title';
      assert.equal(
        adapters.sortAdapter(title, undefined),
        title
      );
    });
    it('Title returned if index is null', () => {
      const title = 'Test Title';
      assert.equal(
        adapters.sortAdapter(title, null),
        title
      );
    });
    it('Title returned if index is not specified', () => {
      const title = 'Test Title';
      assert.equal(
        adapters.sortAdapter(title),
        title
      );
    });
    it('Title returned if index is 0', () => {
      const title = 'Test Title';
      assert.equal(
        adapters.sortAdapter(title, 0),
        title
      );
    });
    it('Partial title returned if index is past start', () => {
      const title = 'Test Title';
      assert.equal(
        adapters.sortAdapter(title, 5),
        'Title'
      );
    });
    it('Title returned if index is past title length', () => {
      const title = 'Test Title';
      assert.equal(
        adapters.sortAdapter(title, 10),
        title
      );
    });
    it('Empty string returned if title is null', () => {
      const title = null;
      assert.equal(
        adapters.sortAdapter(title, 0),
        ''
      );
    });
  });
  describe('When mapping an Event through eventAdapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(channelEvent, adapters.eventAdapter);
    });
    it('the programmeuuid should be mapped to ID', () => {
      assert.equal(
        data.id,
        'ad703f30-701d-4c76-9aea-0b6c726b0dd3'
      );
    });
    it('the st should be mapped to STARTSAT as a moment', () => {
      assert.isTrue(
        moment.isMoment(data.startsAt)
      );
      assert.equal(
        data.startsAt.format('DD MMM YYYY HH:mm:ss'),
        '30 Oct 2016 22:30:00'
      );
    });
    it('the STARTSAT time zone is GMT/UTC', () => {
      assert.equal(
        data.startsAt.utcOffset(),
        0
      );
    });
    it('the DURATION is mapped correctly', () => {
      assert.equal(
        data.duration,
        60
      );
    });
    it('the EVENTID is mapped correctly', () => {
      assert.equal(
        data.eventId,
        'E7d2-f8f8'
      );
    });
    it('the CHANNELGROUPID is mapped correctly', () => {
      assert.equal(
        data.channelGroupId,
        4
      );
    });
    it('the EPISODE NUMBER is mapped correctly', () => {
      assert.equal(
        data.episodeNumber,
        7
      );
    });
    it('the SERIES UUID is mapped correctly', () => {
      assert.equal(
        data.seriesId,
        '0eacb628-63e4-4e2e-9348-707c2c300911'
      );
    });
    it('the TITLE is mapped correctly', () => {
      assert.equal(
        data.title,
        'Question Time'
      );
    });
    it('the SYNOPSIS is mapped correctly', () => {
      assert.equal(
        data.synopsis,
        'David Dimbleby presents topical debate from Gloucester. On the panel are Conservative Greg Clark MP, Labour\'s Keir Starmer MP, Baroness Brinton, Ken Loach and Dia Chakravarty. Also in HD. [S]'
      );
    });
    it('the RATING is mapped correctly', () => {
      assert.equal(
        data.certificate,
        '15'
      );
    });
    it('the AUDIOTYPE is mapped correctly', () => {
      assert.equal(
        data.audioType,
        'S'
      );
    });
    it('the SEASON NUMBER is mapped correctly', () => {
      assert.equal(
        data.seasonNumber,
        1
      );
    });
    it('the SEASON UUID is mapped correctly', () => {
      assert.equal(
        data.seasonId,
        '0c271e2f-b507-4419-9e86-48a11ccd0582'
      );
    });
    it('the HAS SUBTITLES is mapped correctly', () => {
      assert.equal(
        data.hasSubtitles,
        true
      );
    });
    it('the HAS AUDIO DESCRIPTION is mapped correctly', () => {
      assert.equal(
        data.hasAudioDescription,
        true
      );
    });
    it('the IS HD is mapped correctly', () => {
      assert.equal(
        data.isHD,
        true
      );
    });
    it('the IS NEW is mapped correctly', () => {
      assert.equal(
        data.isNew,
        true
      );
    });
    it('the CAN SERIES LINK is mapped correctly', () => {
      assert.equal(
        data.canSeriesLink,
        true
      );
    });
    it('the CAN BE RECORDED is mapped correctly', () => {
      assert.equal(
        data.canBeRemoteRecorded,
        true
      );
    });
    it('the CAN BE SIDELOADED is mapped correctly', () => {
      assert.equal(
        data.canBeSideLoaded,
        true
      );
    });
    it('the IS WIDESCREEN is mapped correctly', () => {
      assert.equal(
        data.isWideScreen,
        true
      );
    });
    it('the MARKETING MESSAGE is mapped correctly', () => {
      assert.equal(
        data.marketingMessage,
        'A Marketing Message'
      );
    });
    it('the IS IPPV is mapped correctly', () => {
      assert.equal(
        data.isOPPV,
        true
      );
    });
    it('the IS OPPV is mapped correctly', () => {
      assert.equal(
        data.isIPPV,
        true
      );
    });
    it('the EVENT GENRE ID is mapped correctly', () => {
      assert.equal(
        data.genreId,
        5
      );
    });
    it('the EVENT SUBGENRE ID is mapped correctly', () => {
      assert.equal(
        data.subGenreId,
        8
      );
    });
    it('the HAS CHILDREN is mapped correctly', () => {
      assert.equal(
        data.hasChildren,
        true
      );
    });
  });
});
