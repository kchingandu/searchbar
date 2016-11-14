import ResiliencyStrategy from '../resiliency/resiliency/ResiliencyStrategy';
import ApiResiliencyValues from '../resiliency/constants/ApiResiliencyValues';
import { resiliencyStrategyConfigFactory } from '../resiliency/resiliency/ResiliencyStrategyConfigFactory';

function createStrategy() {
    let strategyValue = ApiResiliencyValues.SEARCH;
    let config = resiliencyStrategyConfigFactory.createConfig(strategyValue);
    return new ResiliencyStrategy(config);
}

export default { createStrategy };