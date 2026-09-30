# API Development Guidelines & Architectural Contract

> **MANDATORY CONTRACT**: This document is the authoritative standard for designing, creating, modifying, testing, and documenting every API endpoint in this repository. All human developers and AI coding agents (such as Antigravity IDE, Cursor, Claude Code, GitHub Copilot, etc.) **must** strictly adhere to these rules before marking any API task as complete.

---

## 1. Mandatory Instructions for AI-Assisted Development

When an AI coding assistant is asked to create, modify, or refactor an API in this project (e.g., _"Create a POST /posts API"_ or _"Add bio field to user update"_):

1. **Read This Document First**: Treat `API_DEVELOPMENT_GUIDELINES.md` as non-negotiable project law.
2. **Inspect Existing Implementations First**: Before writing any new file, find and inspect an existing API with similar behavior (e.g. inspect `src/routes/auth.routes.ts`, `src/controllers/auth.controller.ts`, `src/services/auth.service.ts`, `src/schemas/auth.schema.ts`, `tests/auth/`, `src/docs/paths/auth.paths.ts`).
3. **Follow the Established Folder Structure**: Never invent new architectural layers, place code in random folders, or mix concerns across layers.
4. **Enforce TypeScript Strictness**: Use native NodeNext ESM imports (`.js` extension on relative imports), strict typing, zero implicit or unnecessary `any` types.
5. **Always Update Swagger/OpenAPI Documentation**: An API task is **incomplete** if its corresponding OpenAPI schemas and path definitions in `src/docs/` are missing or out of date.
6. **Always Add / Update Automated Tests**: Implement comprehensive test cases in `tests/` covering success, validation, authentication, authorization, and error responses.
7. **Run Full Verification**: Run `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run build`.
8. **Explicitly Report Blockers**: If an environment or database issue prevents full local verification, state it explicitly in the final report rather than assuming success.

---

## 2. Before Creating an API

Before writing any new code:

1. **Find an Existing Reference**: Locate an existing endpoint that performs similar operations (e.g., authentication, authenticated mutation, token handling, or profile management).
2. **Inspect Its Route**: Check `src/routes/` to see how middlewares (`validate`, `authenticate`, `rateLimiter`) are chained.
3. **Inspect Its Validation Schema**: Check `src/schemas/` to see how Zod schemas and inferred types are defined and exported.
4. **Inspect Its Controller**: Check `src/controllers/` to see how inputs are extracted and responses are returned.
5. **Inspect Its Service**: Check `src/services/` to see how business rules and `AppError` exceptions are handled.
6. **Inspect Its Tests**: Check `tests/` to see the structure of integration and unit tests using Vitest and Supertest.
7. **Inspect Its Swagger Definitions**: Check `src/docs/schemas/` and `src/docs/paths/` to see how request/response/error schemas and paths are documented.
8. **Follow the Same Pattern**: Replicate the proven pattern unless there is an explicit architectural reason documented in the PR.

---

## 3. API Change Decision Tree

Use this decision tree to determine where code belongs:

```text
Does the API need a new URL or method?
        │
        ├──► Yes ──► Define Route in `src/routes/<domain>.routes.ts`
        │
        ▼
Does the incoming request accept body, query, or params?
        │
        ├──► Yes ──► Define/Update Zod Schema in `src/schemas/<domain>.schema.ts`
        │            Attach `validate(schema)` middleware to the route
        │
        ▼
Does the endpoint require authentication or rate limiting?
        │
        ├──► Yes ──► Attach `authenticate` from `src/middleware/authenticate.ts`
        │            Attach rate limiter from `src/middleware/rate-limit.ts`
        │
        ▼
Does it handle HTTP request/response orchestration?
        │
        ├──► Yes ──► Implement handler in `src/controllers/<domain>.controller.ts`
        │            (Extract data, invoke service, call `res.status().json()`)
        │
        ▼
Does it contain business logic, hashing, transactions, or rules?
        │
        ├──► Yes ──► Implement logic in `src/services/<domain>.service.ts`
        │            (Throw typed `AppError` on failures)
        │
        ▼
Does it interact with the database?
        │
        ├──► Yes ──► Use `prisma` client from `src/db/prisma.ts` inside the service
        │
        ▼
Does the API exist or did its contract change?
        │
        ├──► Always ──► Add/Update OpenAPI schemas in `src/docs/schemas/`
        │               Add/Update OpenAPI paths in `src/docs/paths/`
        │
        ▼
Does the behavior need automated verification?
        │
        └──► Always ──► Add/Update tests in `tests/` and run `npm test`
```

---

## 4. Architectural Overview & Flow of a Request

Every HTTP request must follow this unidirectional pipeline:

```text
[ Incoming HTTP Request ]
          │
          ▼
   1. Route Layer (`src/routes/*.routes.ts`)
      - Define HTTP verb and URL path
      - Attach middleware chain
          │
          ▼
   2. Validation Middleware (`src/middleware/validate.ts`)
      - Validate `req.body`, `req.query`, and `req.params` against Zod schemas (`src/schemas/*.schema.ts`)
      - Reject invalid payloads with standardized `400 Bad Request`
          │
          ▼
   3. Auth & Security Middleware (`src/middleware/authenticate.ts`, `src/middleware/rate-limit.ts`)
      - Validate access token / session cookie
      - Populate `req.user` and `req.session`
          │
          ▼
   4. Controller Layer (`src/controllers/*.controller.ts`)
      - Extract validated inputs from `req`
      - Invoke corresponding Service methods
      - Send HTTP response (`res.status(...).json(...)`)
      - Propagate unhandled errors to `next(error)`
          │
          ▼
   5. Service Layer (`src/services/*.service.ts`)
      - Execute domain rules, hashing, external services, transactions
      - Completely decoupled from Express `req`/`res`
      - Throw typed `AppError` subclasses from `src/errors/AppError.ts`
          │
          ▼
   6. Database Layer (`src/db/prisma.ts`)
      - Execute Prisma ORM queries and migrations
          │
          ▼
   7. Centralized Error Handler (`src/middleware/error-handler.ts`)
      - Intercept all thrown errors
      - Map `AppError` instances to uniform JSON error structures
```

---

## 5. Directory Structure & File Placement Rules

Every file in the codebase has an explicit home:

| Layer / Directory | Location           | Responsibility & Filename Rules                                                                                           |
| :---------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------ |
| **Routes**        | `src/routes/`      | Wire endpoints to middlewares and controllers. Never put business or database logic here. Filename: `<domain>.routes.ts`. |
| **Controllers**   | `src/controllers/` | Extract HTTP parameters, call services, format JSON response. Filename: `<domain>.controller.ts`.                         |
| **Services**      | `src/services/`    | All business rules, encryption, transactions, external APIs. No HTTP objects. Filename: `<domain>.service.ts`.            |
| **Schemas**       | `src/schemas/`     | Zod validation schemas and exported inferred types. Filename: `<domain>.schema.ts`.                                       |
| **Database**      | `src/db/`          | Prisma client singleton (`prisma.ts`), seeds, and DB utilities.                                                           |
| **Errors**        | `src/errors/`      | Operational error classes (`AppError.ts`).                                                                                |
| **Middleware**    | `src/middleware/`  | Reusable Express middlewares (`authenticate.ts`, `validate.ts`, `rate-limit.ts`, `error-handler.ts`, `passport.ts`).      |
| **OpenAPI Docs**  | `src/docs/`        | Modular OpenAPI 3.0 specification (`config.ts`, `openapi.ts`, `swagger.ts`, `schemas/`, `paths/`).                        |
| **Types**         | `src/types/`       | Express augmentations (`express.d.ts`), token payloads, shared interfaces (`index.ts`).                                   |
| **Utils**         | `src/utils/`       | Pure stateless utilities (e.g., `duration.ts`).                                                                           |
| **Emails**        | `src/emails/`      | Email templates and content generators.                                                                                   |
| **Strategies**    | `src/strategies/`  | Passport strategies and OAuth profile normalizers.                                                                        |
| **Tests**         | `tests/`           | Unit, integration, and Swagger tests mirroring the `src/` layout.                                                         |

---

## 6. REST API Design & Naming Conventions

### 6.1 HTTP Verbs

- **`GET`**: Retrieve resources (must be safe and idempotent).
- **`POST`**: Create resources or trigger non-idempotent operations (login, verification, password reset).
- **`PATCH`**: Partially update existing resource fields.
- **`PUT`**: Replace an entire resource.
- **`DELETE`**: Remove resources (returns `204 No Content`).

### 6.2 URL Paths

- Use lowercase kebab-case (e.g., `/auth/resend-verification`, `/users/me/password`).
- Resource endpoints use plural nouns (e.g., `/users`, `/sessions`).
- Authenticated user context uses `/users/me` or `/users/me/<sub-resource>`.
- Avoid action verbs in URLs when HTTP verbs suffice (use `DELETE /users/me` instead of `POST /users/delete`).

### 6.3 Standard HTTP Status Codes

| Status                        | When to Use                                                          |
| :---------------------------- | :------------------------------------------------------------------- |
| **200 OK**                    | Successful `GET`, `PATCH`, or non-creation `POST`.                   |
| **201 Created**               | Successful creation `POST` (e.g., `/auth/register`).                 |
| **204 No Content**            | Successful `DELETE` without a response body.                         |
| **400 Bad Request**           | Validation failed (`AppError.badRequest(...)`).                      |
| **401 Unauthorized**          | Missing or invalid auth token/cookie (`AppError.unauthorized(...)`). |
| **403 Forbidden**             | Authenticated but disallowed (`AppError.forbidden(...)`).            |
| **404 Not Found**             | Record does not exist in the database (`AppError.notFound(...)`).    |
| **409 Conflict**              | Unique constraint violation (`AppError.conflict(...)`).              |
| **429 Too Many Requests**     | Rate limit reached (`AppError.tooManyRequests(...)`).                |
| **500 Internal Server Error** | Unexpected unhandled failure (`AppError.internal(...)`).             |

---

## 7. Mandatory Swagger / OpenAPI Requirements

> **RULE**: An API is **NOT** complete until its Swagger/OpenAPI documentation has been added or updated in `src/docs/`.

### Required Documentation Components

For every new or modified endpoint:

1. **Path Definition** (in `src/docs/paths/<domain>.paths.ts`):
   - `summary`: Short, clear summary.
   - `description`: Detailed behavior and cookie side-effects.
   - `tags`: Grouping tag (e.g., `["Authentication"]`, `["Users"]`).
   - `security`: `[{ cookieAccessTokenAuth: [] }]` for protected routes, `[]` for public.
   - `parameters` / `requestBody`: Explicit schema reference matching Zod validation.
   - `responses`: Document **all** relevant status codes (200/201/204, 400, 401, 403, 404, 409, 429, 500).

2. **Schema Definition** (in `src/docs/schemas/<domain>.schemas.ts`):
   - Reusable request and response schemas matching actual API payloads.
   - Clear field descriptions, types, and example values.
   - Exported in `src/docs/schemas/index.ts` and `src/docs/paths/index.ts`.

3. **Authentication in Swagger**:
   - The backend uses HTTP-only cookies (`accessToken`, `refreshToken`, `oauthState`).
   - Swagger UI is configured with `withCredentials: true`.
   - Logging in via `POST /auth/login` sets cookies in the browser, allowing immediate "Try it out" testing on protected endpoints.

---

## 8. "Do Not Do This" (Architectural Anti-Patterns)

- ❌ **Do not put business logic or database queries in routes**:
  - _Bad_: `router.post('/users', async (req, res) => { await prisma.user.create(...); });`
  - _Good_: Route ➔ Controller ➔ Service ➔ Prisma.
- ❌ **Do not put business logic in controllers**:
  - Controllers only parse HTTP inputs, call services, and return responses.
- ❌ **Do not bypass Zod validation**:
  - Never access raw unvalidated `req.body` directly in business logic.
- ❌ **Do not create duplicate schema definitions**:
  - Align OpenAPI schemas with Zod schemas in `src/schemas/`.
- ❌ **Do not create ad-hoc error shapes**:
  - Always throw `AppError` subclasses so `error-handler.ts` formats consistent JSON error responses.
- ❌ **Do not create a secondary Swagger setup**:
  - Add all docs to the existing modular `src/docs/` hierarchy.
- ❌ **Do not create arbitrary root folders**:
  - Follow the established architecture (`controllers`, `services`, `routes`, `schemas`, `docs`, `middleware`, `types`, `utils`).
- ❌ **Do not leave Swagger documentation outdated**:
  - Whenever an API request/response shape changes, update `src/docs/` in the same commit/task.
- ❌ **Do not use `any`**:
  - Keep strict typing across controllers, services, middlewares, and models.

---

## 9. API Modification Rules

When updating or refactoring an existing API:

1. **Review Existing Tests**: Inspect `tests/` for the existing behavior and assertions.
2. **Review Existing Swagger Documentation**: Check `src/docs/paths/` and `src/docs/schemas/`.
3. **Review Validation**: Check `src/schemas/` to see if fields were added, removed, or changed.
4. **Update Implementation**: Update service, controller, and routes maintaining backward compatibility where possible.
5. **Update Tests**: Update existing test assertions and add new test cases for modified behavior.
6. **Update Swagger**: Update request/response schemas and path descriptions in `src/docs/`.
7. **Run Validation**: Run `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm test`.

---

## 10. Step-by-Step Developer & AI Workflow

```text
Step 1: Understand Requirement & Inspect Existing APIs
   │    - Find similar endpoint in `src/routes/`, `src/controllers/`, `src/services/`, `src/docs/`.
   ▼
Step 2: Create / Update Zod Schema
   │    - File: `src/schemas/<domain>.schema.ts`.
   │    - Export inferred TypeScript types (`z.infer<typeof ...>`).
   ▼
Step 3: Implement / Update Service Logic
   │    - File: `src/services/<domain>.service.ts`.
   │    - Handle Prisma transactions and throw `AppError` on error conditions.
   ▼
Step 4: Implement / Update Controller Handler
   │    - File: `src/controllers/<domain>.controller.ts`.
   │    - Extract validated data, invoke service, return `res.status(...).json(...)`.
   ▼
Step 5: Register Route & Middleware Chain
   │    - File: `src/routes/<domain>.routes.ts`.
   │    - Attach `validate(schema)`, `authenticate`, and rate limiters.
   ▼
Step 6: Add / Update Swagger OpenAPI Documentation
   │    - Files: `src/docs/schemas/<domain>.schemas.ts` and `src/docs/paths/<domain>.paths.ts`.
   │    - Export in barrel files `src/docs/schemas/index.ts` and `src/docs/paths/index.ts`.
   ▼
Step 7: Add / Update Automated Tests
   │    - File: `tests/<domain>/<feature>.test.js`.
   │    - Cover success, validation errors, auth failures, and conflict/not-found cases.
   ▼
Step 8: Run Validation Pipeline & Verify in Swagger UI
        - Run: `npm run typecheck && npm run lint && npm run format:check && npm test && npm run build`.
        - Test interactively in Swagger UI (`http://localhost:<PORT>/api-docs`).
```

---

## 11. Testing Requirements

Every API endpoint must have automated tests in `tests/` covering:

1. **Success Cases**:
   - Correct status code (`200`, `201`, `204`).
   - Expected JSON envelope and data.
   - Database mutations verified.
2. **Validation Cases**:
   - Missing required fields return `400 Bad Request`.
   - Invalid formats (e.g. invalid email, short password) return `400 Bad Request`.
3. **Authentication & Authorization**:
   - Missing token/cookie returns `401 Unauthorized`.
   - Invalid/expired token returns `401 Unauthorized`.
4. **Business Logic & Error Cases**:
   - Duplicate records return `409 Conflict`.
   - Missing records return `404 Not Found`.
5. **OpenAPI Schema Integrity**:
   - `tests/docs/swagger.test.js` passes with 0 broken `$ref` pointers.

---

## 12. Standard API Change Checklist

Copy this checklist into every API pull request, task description, or commit:

```markdown
### API Design & Contract

- [ ] Requirement understood and similar existing API inspected
- [ ] HTTP verb and URL path follow REST kebab-case conventions
- [ ] Authentication requirement confirmed (Public / Cookie-Auth / OAuth)
- [ ] Rate limiting evaluated

### Implementation

- [ ] Zod schema defined/updated in `src/schemas/<domain>.schema.ts`
- [ ] Controller defined/updated in `src/controllers/<domain>.controller.ts`
- [ ] Service defined/updated in `src/services/<domain>.service.ts`
- [ ] Route wired in `src/routes/<domain>.routes.ts` with `validate` & `authenticate`
- [ ] Appropriate HTTP status codes returned (`200`, `201`, `204`)
- [ ] Typed `AppError` thrown on error conditions
- [ ] Strict TypeScript satisfied (no `any`, clean `.js` relative imports)

### Swagger / OpenAPI Documentation

- [ ] Request schema defined in `src/docs/schemas/`
- [ ] Response schemas defined in `src/docs/schemas/`
- [ ] Path operation registered in `src/docs/paths/` with tags, security, responses
- [ ] All error response codes documented (400, 401, 403, 404, 409, 429, 500)
- [ ] Barrel exports updated in `src/docs/schemas/index.ts` and `src/docs/paths/index.ts`

### Testing & Verification

- [ ] Unit & integration tests added in `tests/`
- [ ] Swagger validation test passes (`tests/docs/swagger.test.js`)
- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm run lint` passes (0 warnings/errors)
- [ ] `npm run format:check` passes
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] Verified interactively in Swagger UI (`/api-docs`) via "Try it out"
```

---

## 13. Definition of Done (DoD) for Humans & AI Agents

An API task is **NOT DONE** and must **NOT** be reported as complete until:

1. **Architecture**: Cleanly layered through Routes ➔ Validation ➔ Auth ➔ Controller ➔ Service ➔ Prisma ➔ Error Handler.
2. **Type Safety**: Compiles under TypeScript `strict: true` with NodeNext module resolution.
3. **Input Validation**: All payloads validated with Zod.
4. **Security & Auth**: Authentication enforced via HTTP-only cookies and `authenticate` middleware where required.
5. **OpenAPI Documentation**: Fully documented in `src/docs/` with zero missing paths or broken `$ref` references.
6. **Interactive Swagger**: Endpoint is testable via Swagger UI (`/api-docs`).
7. **Automated Tests**: Unit, integration, and Swagger tests pass 100%.
8. **Verification Pipeline**: `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, and `npm run build` all exit with code `0`.
