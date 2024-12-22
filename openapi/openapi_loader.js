const yaml = require('js-yaml');
const fs = require('fs');


const loadOpenApiFile = () => {
    try {
        return yaml.load(fs.readFileSync('./openapi/swagger.yaml'));
    } catch (e) {
        console.error('Failed loading open api configuration file', e);
        throw e;
    }
};

module.exports = loadOpenApiFile;
