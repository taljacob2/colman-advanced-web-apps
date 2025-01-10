import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

const loadOpenApiFile = () => {
    try {
        const swaggerPath = path.join(__dirname, 'swagger.yaml');
        const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
        return yaml.load(swaggerContent);
    } catch (error) {
        console.error('Error loading OpenAPI file:', error);
        return {};
    }
};

export default loadOpenApiFile;