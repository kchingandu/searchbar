/*
 *
 * OnDemand TV Services
 *
 */

import * as adapters from './adapters';
import pathFactory from './paths';
import { childNodeTypes } from './constants';
import * as map from '../datamap/index';
import {
  jsonRequest,
} from '../utils';

const traverseCatalog = (node, menuItems) => {
  if (!node || !node.childnodes) {
    return;
  }
  switch (adapters.getItemType(node)) {
    case adapters.itemTypes.MENU:
    case adapters.itemTypes.CONTENT: {
      const menuItem = Object.assign(map.run(node, adapters.menuAdapter), {
        items: [],
      });
      menuItems.push(menuItem);
      for (const childnode of node.childnodes) {
        traverseCatalog(childnode, menuItem.items);
      }
      break;
    }
    default:
      return;
  }
};

const ondemandFactory = (endpoints, region, menu) => {
  const paths = pathFactory(endpoints, region);
  return {
    getMenu() {
      const getMenuItems = (bookmark) => new Promise((resolve, reject) => {
        jsonRequest(paths.catalogBookmarkPath(bookmark)).then(catalog => {
          const menu2 = [];
          traverseCatalog(catalog, menu2);
          resolve({
            bookmark,
            menu: menu2.shift(),
          });
        }).catch((e) => {
          reject(`getMenuItems: ${e}`);
        });
      });
      const { topLevelMenuItems } = menu;
      return Promise.all(topLevelMenuItems
        .filter(item => item.bookmark)
        .map(item => getMenuItems(item.bookmark))).then(partialCatalog => {
          const result = topLevelMenuItems.map(item => {
            if (item.bookmark) {
              const index = partialCatalog.findIndex(i => i.bookmark === item.bookmark);
              if (index > -1) {
                const { menu: subMenu } = partialCatalog[index];
                return Object.assign({}, item, {
                  nodeId: subMenu.id,
                  items: subMenu.items,
                });
              }
            }
            return Object.assign({}, item, { nodeId: null, items: [] });
          });
          return result;
        });
    },
    getMenuContent(nodeId) {
      return jsonRequest(paths.catalogueNodePath()).then(catalog => {
        // TODO: Perf improvement.
        // might be able to shorten the hunt here by passing a bookmark.
        const node = adapters.getChildNodeById(catalog, nodeId);
        if (node && node.childnodes) {
          // if the node has no child nodes then do a call.
          // if it has child nodes then accumulate the calls.
          if (node.childnodes.length === 0) {
            return jsonRequest(paths.catalogueNodePath(node.nodeid)).then(result =>
              adapters.automap(result)
            );
          }
          return Promise.all(node.childnodes
            .filter(i => i.childnodetype === childNodeTypes.CONTENT)
            .map(j => jsonRequest(paths.catalogueNodePath(j.nodeid)))).then(childnodes => ({
              id: node.nodeid,
              title: node.nodename,
              items: childnodes.map(adapters.automap),
            })
          );
        }
        return Promise.resolve([]);
      });
    },
    getContentDetails(programmeId) {
      return jsonRequest(paths.contentDetailsPath(programmeId)).then(result =>
        adapters.automap(result)
      );
    },
    getOttDigest() {
      // TODO: Adapter needed.
      return jsonRequest(paths.ottDigestPath()).then(result => result);
    },
  };
};

export default ondemandFactory;
