import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST_USER: 'http://tfm-user-srv-ecs-alb-142142769.eu-west-1.elb.amazonaws.com',
    REST_CORE: 'http://tfm-user-srv-ecs-alb-142142769.eu-west-1.elb.amazonaws.com'
};
