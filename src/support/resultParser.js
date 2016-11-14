import * as adapters from '../q-go-feature-tvservices/src/search/adapters';

const userId = 1;
const section = 'home';

function parse(results) {
    return adapters.suggestionsAdapter(results, section, userId);
}
export default { parse };