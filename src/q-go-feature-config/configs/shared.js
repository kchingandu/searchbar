const hawkApiRoot = 'http://awk.epgsky.com/hawk';

export default {
  endpoints: {
    login: 'https://demo.id.bskyb.com/authorise/skygo?response_type=token&client_id=sky&appearance=compact',
  },
  images: {
    fallback: 'http://s21.postimg.org/5x1haydvb/notfound.png',
    initial: 'http://s22.postimg.org/o1i1rluip/loading.png',
  },
  retry: {
    API_CALL_RETRIES: 3,
    MAX_NUMBER_OF_CHANNEL_IDS_IN_QUERY: 20,
  },
  dataservices: {
    search: {
      clientId: 'SKYGO',
    },
    region: {
      bouquetId: 4101, // London Region
      subBouquetId: 1,
      fieldTrial: null,
    },
    endpoints: {
      linearServices: `${hawkApiRoot}/linear/services/{bouquetId}/{subBouquetId}`,
      linearSchedule: `${hawkApiRoot}/linear/schedule/{date}/{channels}`,
      linearChildEvents: `${hawkApiRoot}/linear/schedule/childevents/{eventId}`,

      ondemandCatalog: `${hawkApiRoot}/ondemand/{bouquetId}/{subBouquetId}/cataloguenode`,
      ondemandCatalogNode: `${hawkApiRoot}/ondemand/{bouquetId}/{subBouquetId}/cataloguenode/{nodeId}`,
      ondemandBookmark: `${hawkApiRoot}/ondemand/{bouquetId}/{subBouquetId}/cataloguebookmark/{bookmark}`,

      ondemandContentDetails: `${hawkApiRoot}/ondemand/contentdetails/{programmeId}`,
      ondemandOttDigest: `${hawkApiRoot}/ondemand/ottDigest`,

      searchSuggestions: 'http://entity.search.sky.com/suggest/v1/{clientid}/{section}/{bouquetId}/{subBouquetId}/{userid}?term={term}&src=ott&limit=25',
      searchResults: 'http://entity.search.sky.com/entity/search/v1/{clientid}/{section}/{bouquetId}/{subBouquetId}/{userid}/{uuidtype}/{uuid}',

      image: 'http://images.metadata.sky.com/pd-image/',
      logo: 'http://images.metadata.sky.com/pd-logo/',
    },
    menu: {
      topLevelMenuItems: [],
    },
  },
};
