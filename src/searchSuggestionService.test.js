import sinon from 'sinon';
import { assert } from 'chai';
import searchSuggestionService from './searchSuggestionService';
import * as URLBuilderModuleExports from './support/URLBuilder';
import * as resultParserModuleExports from './support/resultParser';
import * as resiliencyStrategyFactoryModuleExports from './support/resiliencyFactory';
import * as resilientURLRequestModuleExports from './resiliency/httpRequest/resilientHttpRequest';

describe('searchSuggestionService', () => {
    const searchTerm = 'search';

    it('should call the loader with correct parameters', () => {
        const url = 'www.search.com';
        const resiliencyStrategy = {};

        URLBuilderStub.build.returns(url);
        resiliencyStrategyFactoryStub.createStrategy.returns(resiliencyStrategy);

        searchSuggestionService.search(searchTerm);

        assert.equal(resilientURLRequestStub.args[0][0], url);
        assert.equal(resilientURLRequestStub.args[0][1], null);
        assert.equal(resilientURLRequestStub.args[0][2], resiliencyStrategy);
    });

    it('should convert the response text to valid json', () => {
        const result = { target: { response: '{"suggestion":[{"title":"title 1"}]}' } };

        resilientURLRequestStub.returns({ then: cb =>cb(result) });

        searchSuggestionService.search(searchTerm);

        assert.instanceOf(resultParserStub.parse.args[0][0], Object);
    });

    it('should resolve with an array of suggestions on a succesfull result', () => {
       /* const result = { target: { response: '{"suggestion":[{"title":"title 1"}]}' } };

        resilientURLRequestStub.returns({ then: cb =>cb(result) });

        searchSuggestionService.search(searchTerm).then((result) => {

            assert.isTrue(result.length === 0);
        });*/
    });


    beforeEach(() => {
        stubURLBuilder();
        stubResultParserService();
        stubResilientURLRequest();
        stubResiliencyStrategyFactory();
    });

    afterEach(restoreStubs);
})
;

let URLBuilderStub;
let URLBuilderOriginal;

let resultParserStub;
let resultParserOriginal;

let resilientURLRequestStub;
let resilientURLRequestOriginal;

let resiliencyStrategyFactoryStub;
let resiliencyStrategyFactoryOriginal;

function stubResultParserService() {
    resultParserOriginal = resultParserModuleExports.default;
    resultParserStub = resultParserModuleExports.default = sinon.stub({ parse: Function.prototype });
}

function stubURLBuilder() {
    URLBuilderOriginal = URLBuilderModuleExports.default;
    URLBuilderStub = URLBuilderModuleExports.default = sinon.stub({ build: Function.prototype });
}

function stubResilientURLRequest() {
    resilientURLRequestOriginal = resilientURLRequestModuleExports.default;
    resilientURLRequestStub = resilientURLRequestModuleExports.default = sinon.stub();
}

function stubResiliencyStrategyFactory() {
    resiliencyStrategyFactoryOriginal = resiliencyStrategyFactoryModuleExports.default;
    resiliencyStrategyFactoryStub = resiliencyStrategyFactoryModuleExports.default = sinon.stub({ createStrategy: Function.prototype });
}
function restoreStubs() {
    URLBuilderModuleExports.default = resultParserOriginal;
    resultParserModuleExports.default = resultParserOriginal;
    resilientURLRequestModuleExports.default = resilientURLRequestOriginal;
    resiliencyStrategyFactoryModuleExports.default = resiliencyStrategyFactoryOriginal;
}
