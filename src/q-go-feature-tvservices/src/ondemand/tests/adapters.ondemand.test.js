import { assert } from 'chai';
import * as map from '../../datamap/index';

import {
  series,
  season,
  content,
  collection,
  movies,
} from '@qgo/q-go-utils-testing';

import * as adapters from '../adapters';
import moment from 'moment';

import {
  childNodeTypes,
  directives,
  nodeTypes,
} from '../constants';

describe('Mapping Selector Tests for ChildNodeType', () => {
  it('MENU node selects menuAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        childnodetype: childNodeTypes.MENU,
      }),
      adapters.menuAdapter
    );
  });
  it('CONTENT node selects contentAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        childnodetype: childNodeTypes.CONTENT,
      }),
      adapters.contentAdapter
    );
  });
  it('CONTENT node with SERIES directive selects seriesAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        childnodetype: childNodeTypes.CONTENT,
        renderhints: {
          directive: directives.SERIES,
        },
      }),
      adapters.seriesAdapter
    );
  });
  it('SERIES node with no directive selects seriesAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        type: 'SERIES',
        nodeid: 'C920B0EE19D044EFBDEDD743285FA119/7300733d-0eac-4571-8561-fc8646bf32a1',
        nodename: 24,
        seasoncount: 9,
        programmecount: 0,
        seriesuuid: '7300733d-0eac-4571-8561-fc8646bf32a1',
        providername: 'Sky1',
        renderhints: {
          template: 'MENUPANEL',
        },
      }),
      adapters.seriesAdapter
    );
  });
  it('CONTENT node with SEASON directive selects seasonAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        childnodetype: childNodeTypes.CONTENT,
        renderhints: {
          directive: directives.SEASON,
        },
      }),
      adapters.seasonAdapter
    );
  });
  it('CONTENT node with EDITORIAL directive selects collectionAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        childnodetype: childNodeTypes.CONTENT,
        renderhints: {
          directive: directives.EDITORIAL,
        },
      }),
      adapters.collectionAdapter
    );
  });
});

describe('Mapping Selector Tests for NodeType', () => {
  it('PROGRAMME node selects programmeAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        type: nodeTypes.PROGRAMME,
      }),
      adapters.programmeAdapter
    );
  });
  it('COLLECTION node selects collectionAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        type: nodeTypes.COLLECTION,
      }),
      adapters.collectionAdapter
    );
  });
  it('COLLECTION node with SEASON directive selects seasonAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        type: nodeTypes.COLLECTION,
        renderhints: {
          directive: directives.SEASON,
        },
      }),
      adapters.seasonAdapter
    );
  });
  it('COLLECTION node with SERIES directive selects seriesAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        type: nodeTypes.COLLECTION,
        renderhints: {
          directive: directives.SERIES,
        },
      }),
      adapters.seriesAdapter
    );
  });
  it('COLLECTION node with EDITORIAL directive selects collectionAdapter', () => {
    assert.equal(
      adapters.selectAdapter({
        type: nodeTypes.COLLECTION,
        renderhints: {
          directive: directives.EDITORIAL,
        },
      }),
      adapters.collectionAdapter
    );
  });
});

describe('Catalog Adapter Tests', () => {
  describe('Menu Adapter Tests', () => {
    const menuNode = {
      childnodetype: 'MENU',
      bookmarks: [
        'HPCATCHUP',
      ],
      nodeid: 'CUTV',
      nodename: 'Catch Up',
      classificationtype: 'CUTV',
      renderhints: {
        template: 'MENUPANEL',
      },
      childnodes: [],
    };

    it('can pass menu node to a menuAdapter', () => {
      assert.deepEqual(
        map.run(menuNode, adapters.menuAdapter),
        {
          id: 'CUTV',
          type: 'MENU',
          title: 'Catch Up',
          renderHints: {
            template: 'MENUPANEL',
          },
        }
      );
    });
  });

  describe('When mapping Data through a ContentAdapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(content, adapters.contentAdapter);
    });

    it('the ID should be correct', () => {
      assert.equal(
        data.id,
        '770F002015184D9688DC047315B81F08',
      );
    });

    it('the TITLE should be correct', () => {
      assert.equal(
        data.title,
        'New Premieres',
      );
    });

    it('the SYNOPSIS should be correct', () => {
      assert.equal(
        data.synopsis,
        'The home of new movies for you to watch right now!',
      );
    });

    it('the childnodes collection have 2 items', () => {
      assert.equal(
        data.items.length,
        2
      );
    });

    it('the RENDERHINTS field should have been copied', () => {
      assert.deepEqual(
        data.renderHints,
        {
          template: '5COL',
          imagetype: 'COVER',
        },
      );
    });

    it('the LOGO should return empty string', () => {
      assert.equal(
        data.getLogoUrl(),
        ''
      );
    });

    it('the IMAGE should return empty string', () => {
      assert.equal(
        data.getImageUrl(),
        ''
      );
    });
  });

  describe('When mapping Data through a SeasonAdapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(
        season,
        adapters.seasonAdapter
      );
    });

    it('the TYPE should be correct', () => {
      assert.equal(
        data.type,
        'SEASON'
      );
    });

    it('the ID should be correct', () => {
      assert.equal(
        data.id,
        'C4E0992B7A1146788C5D942AF45C3006/3660607565427393',
      );
    });

    it('the TITLE should be correct', () => {
      assert.equal(
        data.title,
        'The Walking Dead S1',
      );
    });

    it('the SYNOPSIS should be correct', () => {
      assert.equal(
        data.synopsis,
        'After waking from a coma in an abandoned hospital, police officer Rick Grimes (Andrew Lincoln) finds the world he knew gone - ravaged by a zombie epidemic of apocalyptic proportions (Series 1).',
      );
    });

    it('the PROVIDERNAME should be correct', () => {
      assert.equal(
        data.providerName,
        'FOX',
      );
    });

    it('the SEASONNUMBER should be correct', () => {
      assert.equal(
        data.seasonNumber,
        1,
      );
    });

    it('the RENDERHINTS should be copied', () => {
      assert.deepEqual(
        data.renderHints,
        {
          template: '1COL',
          imagetype: '16-9',
          directive: 'SEASON',
        },
      );
    });

    it('the LOGO URL should be be correct', () => {
      assert.equal(
        data.getLogoUrl(100, 200),
        'http://images.metadata.sky.com/pd-logo/skychb_fox/100/200',
      );
    });

    it('the IMAGE URL should be be correct', () => {
      assert.equal(
        data.getImageUrl('cover', 200),
        'http://images.metadata.sky.com/pd-image/2f1fcf42-0b4e-4ad2-9fff-1042e81e33fb/cover/200',
      );
    });
  });

  describe('When mapping Data through a SeriesAdapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(series, adapters.seriesAdapter);
    });
    it('the TYPE should be correct', () => {
      assert.equal(
        data.type,
        'SERIES'
      );
    });

    it('the ID should be correct', () => {
      assert.equal(
        data.id,
        'C4E0992B7A1146788C5D942AF45C3006',
      );
    });

    it('the TITLE should be correct', () => {
      assert.equal(
        data.title,
        'The Walking Dead',
      );
    });

    it('the SYNOPSIS should be correct', () => {
      assert.equal(
        data.synopsis,
        'After the world is ravaged by a zombie apocalypse, a group of survivors, led by police officer Rick Grimes (Andrew Lincoln), desperately search for a safe and secure home. Series 1-6 (Fox).',
      );
    });

    it('the IMAGE should contain the UUID', () => {
      assert.isTrue(
        data.getImageUrl().indexOf('1fb3a089-90e2-4537-8b9c-34dfb813e3e6') > -1
      );
    });

    it('the SEASONS collection have 7 collections', () => {
      assert.equal(
        data.items.length,
        7
      );
    });

    it('the RENDERHINTS field should have been copied', () => {
      assert.deepEqual(
        data.renderHints,
        {
          template: 'MENUPANEL',
          directive: 'SERIES',
        },
      );
    });

    it('the LOGO should return empty string', () => {
      assert.equal(
        data.getLogoUrl(),
        ''
      );
    });
  });

  describe('When mapping Data through a CollectionAdapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(collection, adapters.collectionAdapter);
    });
    it('the TYPE should be correct', () => {
      assert.equal(
        data.type,
        'COLLECTION'
      );
    });

    it('the ID should be correct', () => {
      assert.equal(
        data.id,
        'EBB17A3F81F1484ABBEDB08255B8288A',
      );
    });

    it('the TITLE should be correct', () => {
      assert.equal(
        data.title,
        'Bessie',
      );
    });

    it('the SYNOPSIS should be correct', () => {
      assert.equal(
        data.synopsis,
        'Oscar nominee Queen Latifah stars in this drama following the story of legendary blues performer, Bessie Smith, who rose to fame during the 1920s and 30s. (Sky Atlantic).',
      );
    });

    it('the PROVIDER (Channel) is correct', () => {
      assert.equal(
        data.providerName,
        'testonly',
      );
    });

    it('the RENDERHINTS field should have been copied', () => {
      assert.deepEqual(
        data.renderHints,
        {
          template: '1COL',
          imagetype: '16-9',
          directive: 'EDITORIAL',
        },
      );
    });

    it('the LOGO URL should be be correct', () => {
      assert.equal(
        data.getLogoUrl(100, 200),
        'http://images.metadata.sky.com/pd-logo/skychb_testonly/100/200',
      );
    });

    it('the IMAGE should contain the Collection UUID', () => {
      assert.isTrue(
        data.getImageUrl().indexOf('cee540ea-031e-4363-8931-2b3757789b0d') > -1
      );
    });
  });

  describe('When selecting formats', () => {
    it('handle a non array being passed', () => {
      assert.equal(
        adapters.selectFormat({}),
        null
      );
    });

    it('return null when no valid formats are available', () => {
      assert.equal(
        adapters.selectFormat([{
          videotype: 'SD',
          vodcatalogue: 'OIG',
        }, {
          videotype: '3D',
          vodcatalogue: 'OIG',
        }, {
          videotype: 'HD',
          vodcatalogue: 'OIG',
        }]),
        null
      );
    });

    it('prioritise HD stream over SD when both are available', () => {
      const formats = [{
        videotype: 'SD',
        vodcatalogue: 'OIG',
      }, {
        videotype: 'SD',
        vodcatalogue: 'OTT',
      }, {
        videotype: 'HD',
        vodcatalogue: 'OTT',
      }];
      assert.deepEqual(
        adapters.selectFormat(formats),
        formats[2]
      );
    });

    it('return SD stream when no HD is available', () => {
      const formats = [{
        videotype: 'SD',
        vodcatalogue: 'OIG',
      }, {
        videotype: 'SD',
        vodcatalogue: 'OTT',
      }, {
        videotype: 'SD',
        vodcatalogue: 'OTT',
      }];
      assert.deepEqual(
        adapters.selectFormat(formats),
        formats[1]
      );
    });
  });

  describe.skip('When mapping availabilities through an AvailabilityAdapter', () => {
    let data;
    beforeEach(() => {
      data = map.run(
        [
          {
            availendtime: 1512777599,
            offeringtype: 'STREAMING',
            devices: [
              {
                devicetype: 'DEVICETYPE',
                deviceplatform: 'DEVICEPLATFORM',
              },
            ],
          },
          {
            availendtime: 1512777599,
            offeringtype: 'DOWNLOAD',
            devices: [
              {
                devicetype: 'DEVICETYPE',
                deviceplatform: 'DEVICEPLATFORM',
              },
            ],
          },
        ],
        adapters.availabilityAdapter
      );
    });

    it('Both Availabities are mapped', () => {
      assert.equal(
        data.length,
        2
      );
    });

    it('EndTime should be correct', () => {
      assert.equal(
        data[0].endTime.format(),
        moment.unix(1512777599).utc().format(),
      );
    });

    it('Offering Type should be correct', () => {
      assert.equal(
        data[0].offeringType,
        'STREAMING'
      );
    });

    it('Devices should contain a single item', () => {
      assert.equal(
        data[0].devices.length,
        1
      );
    });

    it('DeviceType should be correct', () => {
      assert.equal(
        data[0].devices[0].deviceType,
        'DEVICETYPE'
      );
    });

    it('DevicePlatform should be correct', () => {
      assert.equal(
        data[0].devices[0].devicePlatform,
        'DEVICEPLATFORM'
      );
    });
  });

  describe('When mapping Movie Data through a ProgramAdapter', () => {
    // grab second episode.
    let data;

    beforeEach(() => {
      data = map.run(
        movies.childnodes[0],
        adapters.programmeAdapter
      );
    });

    it('the TYPE should be correct', () => {
      assert.equal(
        data.type,
        'PROGRAMME'
      );
    });

    it('the ID should be correct', () => {
      assert.equal(
        data.id,
        '8146dcc7-9951-4cc8-bfd5-13076b0aac9f',
      );
    });

    it('the PROGRAMMEID should be correct', () => {
      assert.equal(
        data.programmeId,
        '02b84e086f767510VgnVCM1000000b43150a____',
      );
    });

    it('the TITLE should be correct', () => {
      assert.equal(
        data.title,
        'Black Mass',
      );
    });

    it('the SYNOPSIS should be correct', () => {
      assert.equal(
        data.synopsis,
        '3 Compelling crime drama starring Johnny Depp as notorious Boston gangster James \'Whitey\' Bulger. With Joel Edgerton and Benedict Cumberbatch. (2015)(120 mins)',
      );
    });

    it('the CERTIFICATE should be correct', () => {
      assert.equal(
        data.certificate,
        '15_3',
      );
    });

    it('the IMAGE should contain the Programme UUID', () => {
      assert.isTrue(
        data.getImageUrl().indexOf('8146dcc7-9951-4cc8-bfd5-13076b0aac9f') > -1
      );
    });

    it('the RATING should be correct', () => {
      assert.equal(
        data.rating,
        3,
      );
    });

    it('the VIDEO TYPE should be correct', () => {
      assert.equal(
        data.quality,
        'SD'
      );
    });

    it('the CATALOGUE should be OTT', () => {
      assert.equal(
        data.catalog,
        'OTT'
      );
    });

    it('the DURATION should be correct', () => {
      assert.equal(
        data.duration,
        7382 / 60,
      );
    });

    it('the PROVIDERID should be correct', () => {
      assert.equal(
        data.providerId,
        'bsky_skymovies3'
      );
    });

    it('the PROVIDER NAME should be correct', () => {
      assert.equal(
        data.providerName,
        'Sky Cinema3'
      );
    });

    it('the AVAILABILITIES should be populated', () => {
      assert.equal(
        data.availability.length, 2
      );
    });
  });

  describe('When mapping Episode Data through an EpisodeAdapter', () => {
    // grab second episode.
    let data;

    beforeEach(() => {
      data = map.run(
        season.childnodes[1],
        adapters.episodeAdapter
      );
    });

    it('the TYPE should be correct', () => {
      assert.equal(
        data.type,
        'EPISODE'
      );
    });

    it('the ID should be correct', () => {
      assert.equal(
        data.id,
        'd7a7478d-ac45-4771-9978-1b06b03103b5',
      );
    });

    it('the PROGRAMMEID should be correct', () => {
      assert.equal(
        data.programmeId,
        '25c72b3dae65f410VgnVCM1000000b43150a____',
      );
    });

    it('the TITLE should be correct', () => {
      assert.equal(
        data.title,
        'The Walking Dead',
      );
    });

    it('the EPISODE TITLE should be correct', () => {
      assert.equal(
        data.episodeTitle,
        'Guts',
      );
    });

    it('the SYNOPSIS should be correct', () => {
      assert.equal(
        data.synopsis,
        '3 Guts - Rick unknowingly causes a group of survivors to be trapped by walkers, and the group dynamic devolves from accusations to violence. (S1, Ep2)',
      );
    });

    it('the SEASON NUMBER should be correct', () => {
      assert.equal(
        data.seasonNumber,
        1,
      );
    });


    it('the EPISODENUMBER should be correct', () => {
      assert.equal(
        data.episodeNumber,
        2,
      );
    });

    it('the CERTIFICATE should be correct', () => {
      assert.equal(
        data.certificate,
        '--3',
      );
    });

    it('the IMAGE should contain the Programme UUID', () => {
      assert.isTrue(
        data.getImageUrl().indexOf('d7a7478d-ac45-4771-9978-1b06b03103b5') > -1
      );
    });

    it('the RATING should be correct', () => {
      assert.equal(
        data.rating,
        null,
      );
    });

    it('the VIDEO TYPE should be correct', () => {
      assert.equal(
        data.quality,
        'SD'
      );
    });

    it('the CATALOG should be OTT', () => {
      assert.equal(
        data.catalog,
        'OTT'
      );
    });

    it('the DURATION should be correct', () => {
      assert.equal(
        data.duration,
        3063 / 60,
      );
    });

    it('the PROVIDERID should be correct', () => {
      assert.equal(
        data.providerId,
        'bsky_fx3'
      );
    });

    it('the PROVIDER NAME should be correct', () => {
      assert.equal(
        data.providerName,
        'FOX3'
      );
    });

    it('the AVAILABILITIES should be populated', () => {
      assert.equal(
        data.availability.length, 2
      );
    });
  });
});
