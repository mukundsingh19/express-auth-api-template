import { Router, type Request, type Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from './openapi.js';

const router = Router();

const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
  customSiteTitle: 'Express Auth API - Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    withCredentials: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      activate: true,
      theme: 'agate',
    },
    tryItOutEnabled: true,
  },
};

// Serve raw OpenAPI JSON document for client tools and integrations
router.get('/json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(openApiDocument);
});

// Serve interactive Swagger UI
router.use('/', swaggerUi.serve, swaggerUi.setup(openApiDocument, swaggerUiOptions));

export { router as swaggerDocsRouter, openApiDocument };
export default router;
