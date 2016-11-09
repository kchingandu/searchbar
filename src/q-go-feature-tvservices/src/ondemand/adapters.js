/*
 *
 * Catalogue Adapters
 *
 */

import * as map from '../datamap/index';

import {
  getCatalogueImagePath,
  getProviderLogoImagePath,
} from '../images/paths';

import {
  childNodeTypes,
  nodeTypes,
  vodCatalogs,
  videoTypes,
  directives,
} from './constants';

import {
  fiveStarRating,
  synopsisAdapter,
  certificateAdapter,
  durationAdapter,
} from '../adapters.common';

export const itemTypes = {
  MENU: 'MENU',
  CONTENT: 'CONTENT',
  COLLECTION: 'COLLECTION',
  EPISODE: 'EPISODE',
  SERIES: 'SERIES',
  SEASON: 'SEASON',
  PROGRAMME: 'PROGRAMME',
};

const getImageType = (node) => {
  if (node && node.renderhints && node.renderhints.imagetype) {
    return node.renderhints.imagetype;
  }
  return '16-9';
};

const findSeasonNumber = (childnodes) => {
  if (childnodes && childnodes.length > 0) {
    return childnodes[0].seasonnumber;
  }
  return null;
};

const getDirective = (node) => {
  if (node && node.renderhints) {
    return node.renderhints.directive || null;
  }
  return null;
};

export const isValidFormat = (format) =>
  isValidCatalogue(format.vodcatalogue) &&
  isVideoDefinitionAllowed(format.videotype);

export const isValidCatalogue = (catalog) =>
  (catalog === vodCatalogs.OTT);

export const isVideoDefinitionAllowed = (definition) =>
  definition === videoTypes.SD || definition === videoTypes.HD;

export const selectFormat = (formats) => {
  if (!Array.isArray(formats)) {
    return null;
  }
  // rule is to select, the OTT, HD format then fall back to SD.
  const allowedFormats = formats.filter(isValidFormat);
  if (allowedFormats.length === 0) {
    return null;
  }
  if (allowedFormats.length === 1) {
    return allowedFormats[0];
  }
  const hdIndex = allowedFormats.findIndex(f => f.videotype === videoTypes.HD);
  if (hdIndex > -1) {
    return allowedFormats[hdIndex];
  }
  return allowedFormats[0];
};

export const getItemType = (node) => {
  if (node.childnodetype) {
    switch (node.childnodetype) {
      case childNodeTypes.MENU: {
        return itemTypes.MENU;
      }
      case childNodeTypes.CONTENT: {
        switch (getDirective(node)) {
          case directives.SEASON: {
            return itemTypes.SEASON;
          }
          case directives.SERIES: {
            return itemTypes.SERIES;
          }
          case directives.EDITORIAL: {
            return itemTypes.COLLECTION;
          }
          default: {
            return itemTypes.CONTENT;
          }
        }
      }
      default:
        break;
    }
  } else if (node.type) {
    switch (node.type) {
      case nodeTypes.SERIES: {
        return itemTypes.SERIES;
      }
      case nodeTypes.PROGRAMME: {
        return itemTypes.PROGRAMME;
      }
      case nodeTypes.COLLECTION: {
        switch (getDirective(node)) {
          case directives.SEASON: {
            return itemTypes.SEASON;
          }
          case directives.SERIES: {
            return itemTypes.SERIES;
          }
          case directives.EDITORIAL:
          default: {
            return itemTypes.COLLECTION;
          }
        }
      }
      default:
        break;
    }
  }
  return null;
};

const errorAdapter = map.create({}, node => ({
  type: 'ERROR',
  message: 'Failed to Select Adapter',
  node,
  items: [],
  getLogoUrl: () => '',
  getImageUrl: () => '',
}));

export const menuAdapter = map.create({
  nodeid: map.to('id').string,
  nodename: map.to('title').string,
  renderhints: map.to('renderHints').object.optional,
  childnodetype: map.ignore,
  childnodes: map.ignore,
  classificationtype: map.ignore,
  bookmarks: map.ignore,
  brandinguri: map.ignore,
  imageuri_3x4: map.ignore,
  imageuri_16x9: map.ignore,
}, {
  type: itemTypes.MENU,
});

export const contentAdapter = map.create({
  nodeid: map.to('id'),
  nodename: map.to('title'),
  sy: map.to('synopsis').with(synopsisAdapter, 'synopsisAdapter'),
  renderhints: map.to('renderHints'),
  childnodes: map.to('items').each.with((node) => selectAdapter(node)),
  childnodetype: map.ignore,
}, {
  type: itemTypes.CONTENT,
  getLogoUrl: () => '',
  getImageUrl: () => '',
});

export const seriesAdapter = map.create({
  nodeid: map.to('id'),
  nodename: map.to('title'),
  sy: map.to('synopsis').with(synopsisAdapter),
  childnodes: map.to('items').each.with((node) => selectAdapter(node)),
  renderhints: map.to('renderHints'),
  childnodetype: map.ignore,
  classificationuuid: map.ignore,
  imageuri_3x4: map.ignore,
  imageuri_16x9: map.ignore,
}, (node) => ({
  type: itemTypes.SERIES,
  getLogoUrl: () => '',
  getImageUrl: (type = getImageType(node), width) => getCatalogueImagePath({
    uuid: node.classificationuuid,
    type,
    width,
  }),
}));

// http://awk.epgsky.com/hawk/ondemand/4097/1/cataloguenode/5062CC72BE78434B9FACE0A1A22E4350/3660607565427393
// Seasons. Contains Episodes.
export const seasonAdapter = map.create({
  nodeid: map.to('id'),
  nodename: map.to('title'),
  sy: map.to('synopsis').with(synopsisAdapter),
  // childnodes: map.to('items').each.with((node) => selectAdapter(node)),
  renderhints: map.to('renderHints'),
  providername: map.to('providerName'),
  type: map.ignore,
  childnodetype: map.ignore,
  collectionuuid: map.ignore,
  classificationuuid: map.ignore,
  imageuri_3x4: map.ignore,
  imageuri_16x9: map.ignore,
}, (node) => ({
  type: itemTypes.SEASON,
  seasonNumber: findSeasonNumber(node.childnodes),
  getLogoUrl: (width, height) => getProviderLogoImagePath({
    providerName: node.providername,
    width,
    height,
  }),
  getImageUrl: (type = getImageType(node), width) => getCatalogueImagePath({
    uuid: node.classificationuuid,
    type,
    width,
  }),
}));

export const collectionAdapter = map.create({
  type: map.ignore,
  childnodetype: map.ignore,
  nodeid: map.to('id'),
  nodename: map.to('title'),
  sy: map.to('synopsis').with(synopsisAdapter),
  renderhints: map.to('renderHints'),
  providername: map.to('providerName').optional,
  childnodes: map.to('items').each.with((node) => selectAdapter(node)).optional,
  classificationuuid: map.ignore,
  imageuri_3x4: map.ignore,
  imageuri_16x9: map.ignore,
  collectionuuid: map.ignore,
}, (node) => ({
  type: itemTypes.COLLECTION,
  getLogoUrl: (width, height) => getProviderLogoImagePath({
    providerName: node.providername,
    width,
    height,
  }),
  getImageUrl: (type, width) => getCatalogueImagePath({
    uuid: node.classificationuuid,
    type,
    width,
  }),
}));

export const deviceAdapter = map.create({
  devicetype: map.to('deviceType'),
  deviceplatform: map.to('devicePlatform'),
});

export const availabilityAdapter = map.create({
  availendtime: map.to('endTime').epoch,
  offeringtype: map.to('offeringType').string,
  devices: map.ignore, // Currently not in use. to('devices').with(deviceAdapter),
});

export const formatAdapter = map.create({
  // The video type ("HD", "SD", "3D", "4K", "RA")
  videotype: map.to('quality'),
  vodcatalogue: map.to('catalog'),
  programmeid: map.to('programmeId'),
  pushedprogrammeid: map.ignore,
  d: map.to('duration').with(durationAdapter),
  providerid: map.to('providerId'),
  providername: map.to('providerName'),
  r: map.to('certificate').with(certificateAdapter),
  sy: map.to('synopsis').with(synopsisAdapter),
  availabilities: map.to('availability').with(availabilityAdapter),
  size: map.ignore,
  at: map.to('audioType'),
  ad: map.to('hasAudioDescription').bool,
  bto: map.to('isBuyToOwn').bool,
  s: map.to('hasSubtitles').bool,
  ppv: map.to('isPPV').bool,
  platforms: map.to('platforms'),
}, format => ({
  getLogoUrl: (width, height) => getProviderLogoImagePath({
    providerName: format.providername,
    width,
    height,
  }),
}));

const programmeCommon = map.create({
  programmeuuid: map.to('id').string,
  t: map.to('title').string,
  sy: map.to('synopsis').with(synopsisAdapter),
  r: map.to('certificate').with(certificateAdapter),
  reviewrating: map.to('rating').with(fiveStarRating).optional,
  type: map.ignore,
  episodenumber: map.ignore,
  episodetitle: map.ignore,
  formats: map.required,
  // todo: something like this?
  // formats: map.array(formatAdapter).filter(selectFormat)
}, node => ({
  // TODO: make some DSL thing for arrays
  ...map.run(selectFormat(node.formats), formatAdapter),
  getImageUrl: (type, width) => getCatalogueImagePath({
    uuid: node.programmeuuid,
    type,
    width,
  }),
  getLogoUrl: () => '',
}));

export const episodeAdapter = map.combine(programmeCommon, map.create({
  episodetitle: map.to('episodeTitle').string,
  seasonnumber: map.to('seasonNumber').number,
  episodenumber: map.to('episodeNumber').number,
}, {
  type: itemTypes.EPISODE,
}));

export const programmeAdapter = map.combine(programmeCommon, map.create({}, {
  type: itemTypes.PROGRAMME,
}));

export const selectAdapter = (node) => {
  switch (getItemType(node)) {
    case itemTypes.MENU: {
      return menuAdapter;
    }
    case itemTypes.CONTENT: {
      return contentAdapter;
    }
    case itemTypes.COLLECTION: {
      return collectionAdapter;
    }
    case itemTypes.EPISODE: {
      return episodeAdapter;
    }
    case itemTypes.SERIES: {
      return seriesAdapter;
    }
    case itemTypes.SEASON: {
      return seasonAdapter;
    }
    case itemTypes.PROGRAMME: {
      return programmeAdapter;
    }
    default:
      break;
  }
  console.log('selectAdapter: Failed to select adapter');
  return errorAdapter;
};

export const automap = (node) => map.run(node, selectAdapter(node));

export const getChildNodeById = (node, nodeid) => {
  if (node && node.nodeid === nodeid) {
    return node;
  }
  if (!node || !nodeid || !node.childnodes) {
    return undefined;
  }
  for (const childnode of node.childnodes) {
    if (childnode.nodeid === nodeid) {
      return childnode;
    }
    const found = getChildNodeById(childnode, nodeid);
    if (found) {
      return found;
    }
  }
  return null;
};
