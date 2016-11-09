import {
  replaceRegion,
  replaceTokens,
} from '../utils';

const pathFactory = (endpoints, region) => {
  const replace = (url, tokens) => replaceRegion(replaceTokens(url, tokens), region);
  return {
    // Returns the root node of the On Demand catalogue for a given region.
    // The root hierarchy contains node IDs for high level sections (called classifications) of the On Demand catalogue.
    // These node IDs can be added onto this API to drill down into the catalogue.
    catalogueNodePath(nodeId) {
      const { ondemandCatalog, ondemandCatalogNode } = endpoints;
      if (!nodeId) {
        return replace(ondemandCatalog, {});
      }
      return replace(ondemandCatalogNode, {
        nodeId,
      });
    },
    catalogBookmarkPath(bookmark) {
      const { ondemandBookmark } = endpoints;
      return replace(ondemandBookmark, {
        bookmark,
      });
    },
    // Gets the full details for any programme ID.
    // Params: {
    //  programmeId: The id of the programme. This ID come from the On Demand catalogue encoders and is different from the UUID.
    // }
    contentDetailsPath(programmeId) {
      const { ondemandContentDetails } = endpoints;
      return replace(ondemandContentDetails, {
        programmeId,
      });
    },
    // Returns a full list of programme UUIDs for items which exist in the
    // OTT catalogue and which are currently available for streaming and/or downloading.
    ottDigestPath() {
      const { ondemandOttDigest } = endpoints;
      return replace(ondemandOttDigest);
    },
  };
};

export default pathFactory;
