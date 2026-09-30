import { openApiConfig } from './config.js';
import { openApiSchemas } from './schemas/index.js';
import { openApiPaths } from './paths/index.js';

export const openApiDocument = {
  ...openApiConfig,
  paths: openApiPaths,
  components: {
    ...openApiConfig.components,
    schemas: openApiSchemas,
  },
};

export default openApiDocument;
