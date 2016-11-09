const root = 'http://localhost:3003/hawk';

export default {
  endpoints: {
    // TODO: move this?
    login: 'http://localhost:3003/authorise',
  },
  dataservices: {
    endpoints: {
      linearServices: `${root}/linear/services/{bouquetId}/{subBouquetId}`,
      linearSchedule: `${root}/linear/schedule/{date}/{channels}`,
      linearChildEvents: `${root}/linear/schedule/childevents/{eventId}`,

      ondemandCatalog: `${root}/ondemand/{bouquetId}/{subBouquetId}/cataloguenode`,
      ondemandCatalogNode: `${root}/ondemand/{bouquetId}/{subBouquetId}/cataloguenode/{nodeId}`,
      ondemandBookmark: `${root}/ondemand/{bouquetId}/{subBouquetId}/cataloguebookmark/{bookmark}`,

      ondemandContentDetails: `${root}/ondemand/contentdetails/{programmeId}`,
      ondemandOttDigest: `${root}/ondemand/ottDigest`,

      searchSuggestions: `${root}/{clientid}/{section}/{bouquetId}/{subBouquetId}/{userid}?term={term}`,
      searchResults: `${root}/{clientid}/{section}/{bouquetId}/{subBouquetId}/{userid}/{uuidtype}/{uuid}`,

      image: 'http://images.metadata.sky.com/pd-image/',
      logo: 'http://images.metadata.sky.com/pd-logo/',
    },
    menu: {
      topLevelMenuItems: [
        /* the paths are temporary until routing is updated */
        { id: '1', path: '/', title: 'TestTitle' },
        { id: '2', path: '/testpath2', title: 'TestTitle2', bookmark: 'HPCATCHUP' },
        { id: '3', path: '/ondemand/BE4D8AF02C5141FEAD6BC15F12347575', title: 'Catch Up TV', bookmark: 'HPCATCHUP' },
        { id: '4', path: '/recordings', title: 'Recordings' },
        { id: '5', path: '/ondevice', title: 'On My Device' },
        { id: '6', path: '/myq', title: 'My Q' },
        { id: '7', path: '/toppicks', title: 'Top Picks' },
        { id: '8', path: '/ondemand/EED43A281644468DA80DC01C5BCBDFB5', title: 'Sky Box Sets', bookmark: 'HPBOXSETS' },
        { id: '9', path: '/ondemand/286E3735E0AD48868E431D55A1F4A131', title: 'Sky Cinema', bookmark: 'HPMOVIES' },
        { id: '10', path: '/settings', title: 'Settings' },
      ],
    },
  },
};
