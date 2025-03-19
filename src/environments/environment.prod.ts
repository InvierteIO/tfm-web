import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    REST_USER: 'https://user.invierte.io',
    REST_CORE: 'https://core.invierte.io'
};
