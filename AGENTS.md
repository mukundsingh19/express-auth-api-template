# AI Assistant Instructions & Project Guidelines

Welcome to the **express-auth-api-template** repository.

## 1. Mandatory API Development Rule

Whenever you are asked to **create**, **modify**, **refactor**, or **document** any API endpoint in this repository:

> **You MUST read and strictly follow [`API_DEVELOPMENT_GUIDELINES.md`](./API_DEVELOPMENT_GUIDELINES.md).**

Do not invent custom folder structures, place business logic in controllers/routes, bypass Zod validation, or omit Swagger/OpenAPI documentation.

## 2. Core Architectural Principles

1. **Layered Pipeline**: `Route` ➔ `validate(schema)` ➔ `authenticate` ➔ `Controller` ➔ `Service` ➔ `Prisma` ➔ `error-handler`.
2. **TypeScript & NodeNext**: Strict mode (`strict: true`), native ESM NodeNext module resolution (use `.js` extension on relative imports).
3. **Mandatory Swagger / OpenAPI**:
   - All schemas go in `src/docs/schemas/`.
   - All path operations go in `src/docs/paths/`.
   - Interactive Swagger UI is hosted at `/api-docs`.
4. **Mandatory Testing**: Add unit/integration tests in `tests/` for success, validation, authentication, and error cases.

## 3. Pre-Completion Verification Checklist

Before reporting an API task as complete, you must run:

```bash
npm run typecheck       # Verify TypeScript compiles with 0 errors
npm run lint            # Verify ESLint passes with 0 warnings/errors
npm run format:check    # Verify Prettier code formatting
npm run build           # Verify tsc build succeeds
npm test                # Run test suite and Swagger verification
```
