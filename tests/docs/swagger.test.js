import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app.js';
import { openApiDocument } from '../../src/docs/openapi.js';

describe('Swagger / OpenAPI Documentation', () => {
  it('serves the Swagger UI HTML page at /api-docs/', async () => {
    const response = await request(app).get('/api-docs/').redirects(1);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.text).toContain('swagger-ui');
  });

  it('serves the raw OpenAPI JSON specification at /api-docs/json', async () => {
    const response = await request(app).get('/api-docs/json');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toMatchObject({
      openapi: '3.0.3',
      info: {
        title: 'Express Auth API Template',
        version: '1.0.0',
      },
    });
  });

  it('contains valid OpenAPI metadata and servers', () => {
    expect(openApiDocument.openapi).toBe('3.0.3');
    expect(openApiDocument.info.title).toBe('Express Auth API Template');
    expect(openApiDocument.info.version).toBe('1.0.0');
    expect(Array.isArray(openApiDocument.servers)).toBe(true);
    expect(openApiDocument.servers.length).toBeGreaterThan(0);
  });

  it('contains required security schemes for cookie-based authentication', () => {
    const securitySchemes = openApiDocument.components?.securitySchemes;

    expect(securitySchemes).toBeDefined();
    expect(securitySchemes?.cookieAccessTokenAuth).toMatchObject({
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
    });
    expect(securitySchemes?.cookieRefreshTokenAuth).toMatchObject({
      type: 'apiKey',
      in: 'cookie',
      name: 'refreshToken',
    });
    expect(securitySchemes?.cookieOAuthStateAuth).toMatchObject({
      type: 'apiKey',
      in: 'cookie',
      name: 'oauthState',
    });
  });

  it('documents all existing API routes', () => {
    const expectedPaths = [
      '/health',
      '/auth/register',
      '/auth/login',
      '/auth/me',
      '/auth/refresh',
      '/auth/logout',
      '/auth/email/verify',
      '/auth/email/resend',
      '/auth/password/forgot',
      '/auth/password/reset',
      '/auth/google',
      '/auth/google/authorize',
      '/auth/google/callback',
      '/auth/github',
      '/auth/github/authorize',
      '/auth/github/callback',
      '/users/me',
      '/users/me/password',
      '/users/me/username',
      '/users/me/email',
      '/users/me/email/confirm',
    ];

    const documentedPaths = Object.keys(openApiDocument.paths);

    for (const path of expectedPaths) {
      expect(documentedPaths).toContain(path);
    }
  });

  it('verifies that all $ref schema pointers resolve to existing components', () => {
    const schemas = openApiDocument.components?.schemas || {};
    const schemaKeys = Object.keys(schemas);

    const checkRefs = (obj) => {
      if (!obj || typeof obj !== 'object') return;

      if (obj.$ref && typeof obj.$ref === 'string') {
        const refMatch = obj.$ref.match(/^#\/components\/schemas\/(.+)$/);
        if (refMatch) {
          const targetSchemaName = refMatch[1];
          expect(schemaKeys).toContain(targetSchemaName);
        }
      }

      for (const key of Object.keys(obj)) {
        checkRefs(obj[key]);
      }
    };

    checkRefs(openApiDocument.paths);
    checkRefs(openApiDocument.components);
  });
});
