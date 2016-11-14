import config from '../q-go-feature-config/configs/shared';
import pathFactory from '../q-go-feature-tvservices/src/search/paths';

const userId = 1;
const section = 'home';
const { clientId } = config.dataservices.search;
const { region, endpoints } =config.dataservices;

const paths = pathFactory(clientId, endpoints, region);

function build(searchTerm) {
    return paths.searchSuggestPath(section, userId, searchTerm)

}

export default { build };