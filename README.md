# Express Auth API Template

A production-oriented, fully type-safe, reusable authentication and user-management REST API built with **TypeScript**, **Express**, **PostgreSQL**, **Prisma**, **Passport**, **JWT**, **Zod**, and secure HTTP-only cookies.

This project is designed to be used as a **starting point for future web applications**. It provides the complete authentication and account-management foundation so application-specific features can be built on top of it without repeatedly rebuilding authentication infrastructure.

The template is intentionally modular: authentication, sessions, OAuth, validation, email workflows, and user management are separated into focused, strictly typed modules that can be reused or extended as needed.

---

## Features

### Authentication

- Local email/password authentication
- Google OAuth 2.0
- GitHub OAuth
- JWT access tokens
- JWT refresh tokens
- HTTP-only authentication cookies
- Refresh-token rotation
- Server-side session tracking
- Session revocation
- Authentication middleware
- Secure logout
- Password changes
- Password reset flow
- Email verification
- Email address change verification
- Account deletion

### Security

- Password hashing with `bcryptjs`
- Separate access-token and refresh-token secrets
- Refresh-token hashes stored in the database instead of raw tokens
- Refresh-token rotation and reuse detection
- Session revocation after password changes and password resets
- Cryptographically secure verification codes and tokens
- OAuth state validation using `crypto.timingSafeEqual`
- Rate limiting on authentication-sensitive endpoints
- Zod request validation and type inference
- Helmet security headers
- Credentialed CORS restricted to the configured frontend origin
- Centralized error handling
- Prisma database constraints as the final protection against race conditions
- Generic authentication errors that avoid unnecessarily exposing account information
- Secure cookie configuration for production environments

### Developer Experience & TypeScript

- **100% TypeScript** with strict type checking (`strict: true`)
- **NodeNext Module Resolution** (`module: "NodeNext"`, `moduleResolution: "NodeNext"`) with native ES Modules
- **Fast Development Workflow** powered by `tsx` hot reloading
- Complete type definitions for Express requests, middleware, services, and database models
- **Prisma ORM** with PostgreSQL
- **Vitest & Supertest** automated testing suite
- **ESLint & Prettier** code quality and formatting
- Environment variable validation and typing with Zod
- Clean layered architecture (Routes -> Middleware -> Controllers -> Services -> Persistence)
- Declarations and source maps generated on build (`dist/`)
- Optional email infrastructure with Resend

---

## Why This Template Exists

Authentication is infrastructure.

It is something almost every full-stack application needs, but it is also an area where small implementation mistakes can create serious security problems.

Instead of rebuilding registration, login, sessions, password resets, email verification, OAuth, rate limiting, and account management for every application, this project provides a robust, type-safe reusable foundation.

The intended workflow is:

```text
                 Express Auth API (TypeScript)
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
  Authentication         User Accounts             Sessions
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                        Your Application
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
      Posts                 Messages               Projects
```

Application-specific functionality should be built **on top of** the authentication layer rather than tightly coupling business logic to it.

For example, a future application could add:

```text
src/
├── controllers/
│   ├── auth.controller.ts
│   ├── oauth.controller.ts
│   ├── user.controller.ts
│   └── post.controller.ts
│
├── services/
│   ├── auth.service.ts
│   ├── session.service.ts
│   ├── user.service.ts
│   └── post.service.ts
│
└── ...
```

and then introduce its own application-specific modules without having to redesign authentication.

---

## Architecture

The API follows a layered architecture:

```text
HTTP Request
     │
     ▼
   Routes
     │
     ▼
 Middleware
 ├── Rate limiting
 ├── Authentication
 ├── Validation
 └── Passport
     │
     ▼
Controllers
     │
     ▼
 Services
     │
     ▼
  Prisma
     │
     ▼
PostgreSQL
```

### Responsibilities

| Layer              | Responsibility                                                  |
| ------------------ | --------------------------------------------------------------- |
| `src/routes/`      | Defines HTTP endpoints and middleware composition               |
| `src/middleware/`  | Authentication, validation, rate limiting, error handling       |
| `src/controllers/` | Handles HTTP requests and responses                             |
| `src/services/`    | Contains application and authentication business logic          |
| `src/strategies/`  | Passport authentication strategies and OAuth profile processing |
| `src/schemas/`     | Zod request validation schemas and inferred types               |
| `src/config/`      | Environment, cookies, and Passport configuration                |
| `src/db/`          | Prisma client and database adapter initialization               |
| `src/emails/`      | Email content and template generators                           |
| `src/errors/`      | Application-specific error classes (`AppError`)                 |
| `src/types/`       | TypeScript declaration augmentations and shared types           |
| `src/utils/`       | Reusable utility functions                                      |

The goal is to keep HTTP concerns, authentication logic, persistence, and reusable utilities from becoming unnecessarily intertwined.

---

# TypeScript Configuration

The project is configured with modern, strict TypeScript settings using the NodeNext module system:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*", "generated/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Key TypeScript Rules

1. **Relative Imports with `.js` Extension**: Because NodeNext preserves native ESM semantics, relative imports in TypeScript source files specify `.js` extensions (e.g. `import { env } from '../config/env.js';`). TypeScript resolves them to corresponding `.ts` source files during type-checking and compilation.
2. **Strict Mode Enabled**: Full strict checking (`strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`) ensures no implicit `any` types and complete null safety.
3. **Build Artifacts**: Compiling with `npm run build` generates clean JavaScript in `./dist` along with `.d.ts` type declarations, declaration maps, and source maps.

---

# Authentication Architecture

## Local Authentication

The local login flow is:

```text
POST /auth/login
       │
       ▼
Request validation
       │
       ▼
Rate limiter
       │
       ▼
Passport Local Strategy
       │
       ├── Find user
       ├── Verify password
       └── Verify email
       │
       ▼
Create session
       │
       ├── Generate access token
       └── Generate refresh token
       │
       ▼
HTTP-only cookies
```

The API does not return authentication tokens in the JSON response. Instead, tokens are stored in HTTP-only cookies.

---

## Access Tokens

Access tokens are short-lived JWTs containing the authenticated user's identifier. They are used to authenticate normal API requests.

```text
Client
  │
  │ accessToken cookie
  ▼
authenticate middleware
  │
  ├── Verify JWT
  ├── Find user in database
  └── Attach user to req.user
```

---

## Refresh Tokens

Refresh tokens are longer-lived JWTs associated with a server-side session.

The database stores a SHA-256 hash of the refresh token rather than the raw token.

A refresh request:

```text
Refresh Token
      │
      ▼
Verify JWT
      │
      ▼
Find Session
      │
      ▼
Compare Token Hash
      │
      ▼
Rotate Token
      │
      ├── Replace stored hash
      ├── Update lastUsedAt
      └── Extend expiration
      │
      ▼
Issue New Access + Refresh Tokens
```

If a previously rotated refresh token is reused, the session is revoked. This gives the application server-side control over otherwise stateless JWT refresh credentials.

---

# OAuth Architecture

Google and GitHub authentication are implemented through Passport.

The flow is intentionally separated into multiple stages:

```text
OAuth Provider
      │
      ▼
Passport Strategy
      │
      ▼
Provider Profile Processor
      │
      ▼
OAuth Service
      │
      ├── Find existing account
      ├── Find existing user
      ├── Generate username
      └── Create user + account
      │
      ▼
Create Authentication Session
      │
      ▼
HTTP-only Cookies
```

Provider-specific profile processing is kept separate from database operations so additional OAuth providers can be added without placing provider-specific logic inside the core OAuth service.

Google and GitHub are optional. The application only configures a provider when its required environment variables are present.

---

# Project Structure

```text
express-auth-api-template/
├── dist/                          # Compiled production output
├── generated/
│   └── prisma/                    # Generated Prisma client and models
├── prisma/
│   ├── migrations/                # Database migrations
│   └── schema.prisma              # Prisma schema definition
├── src/
│   ├── config/
│   │   ├── cookies.ts             # Cookie configurations
│   │   ├── env.ts                 # Validated environment configuration
│   │   └── passport.ts            # Passport initialization
│   ├── controllers/
│   │   ├── auth.controller.ts     # Authentication HTTP handlers
│   │   ├── oauth.controller.ts    # OAuth flow handlers
│   │   └── user.controller.ts     # User profile and account handlers
│   ├── db/
│   │   └── prisma.ts              # Prisma client instance & pg adapter
│   ├── emails/
│   │   ├── email-change.ts        # Email change email template
│   │   ├── email-verification.ts  # Verification code email template
│   │   └── password-reset.ts      # Password reset email template
│   ├── errors/
│   │   └── AppError.ts            # Custom operational error class
│   ├── middleware/
│   │   ├── authenticate.ts        # JWT cookie authentication middleware
│   │   ├── error-handler.ts       # Centralized error handler
│   │   ├── passport.ts            # Passport local authentication middleware
│   │   ├── rate-limit.ts          # Endpoint-specific rate limiters
│   │   └── validate.ts            # Zod validation middleware
│   ├── routes/
│   │   ├── auth.routes.ts         # Authentication routes
│   │   └── user.routes.ts         # User account management routes
│   ├── schemas/
│   │   ├── auth.schema.ts         # Auth request validation schemas
│   │   ├── common.schema.ts       # Shared validation rules
│   │   └── user.schema.ts         # User request validation schemas
│   ├── services/
│   │   ├── auth.service.ts        # Auth registration & session creation
│   │   ├── email-change.service.ts # Email change business logic
│   │   ├── email-verification.service.ts # Verification email logic
│   │   ├── email.service.ts       # Resend email delivery service
│   │   ├── oauth.service.ts       # OAuth user lookup and creation
│   │   ├── oauth.state.service.ts # OAuth state generation and validation
│   │   ├── password-reset.service.ts # Password reset business logic
│   │   ├── password.service.ts    # Bcrypt password hashing & verification
│   │   ├── session.service.ts     # Session lifecycle, rotation & revocation
│   │   ├── token.service.ts       # JWT access/refresh token operations
│   │   ├── user.service.ts        # User database operations
│   │   └── verification-token.service.ts # OTP & token generation/verification
│   ├── strategies/
│   │   ├── github-profile.ts      # GitHub profile parser & normalizer
│   │   ├── github.strategy.ts     # Passport GitHub OAuth strategy
│   │   ├── google-profile.ts      # Google profile parser & normalizer
│   │   ├── google.strategy.ts     # Passport Google OAuth strategy
│   │   └── local.strategy.ts      # Passport local username/password strategy
│   ├── types/
│   │   ├── express.d.ts           # Express Request & User type augmentations
│   │   └── index.ts               # Shared interfaces and type definitions
│   ├── utils/
│   │   └── duration.ts            # Duration parser helper (e.g., "15m", "7d")
│   ├── app.ts                     # Express app setup and middleware chain
│   └── server.ts                  # HTTP server entry point
├── tests/
│   ├── auth/                      # Authentication integration tests
│   ├── configuration/             # Feature flag configuration tests
│   ├── controllers/               # Controller unit tests
│   ├── emails/                    # Email template unit tests
│   ├── services/                  # Service unit tests
│   ├── strategies/                # Strategy and parser unit tests
│   ├── users/                     # User management integration tests
│   └── setup.js                   # Vitest setup & teardown
├── .env.example                   # Environment variable template
├── .env.test                      # Test environment configuration
├── eslint.config.js               # ESLint configuration (TypeScript + Prettier)
├── package.json                   # Project dependencies and scripts
├── prisma.config.ts               # Prisma CLI configuration
├── tsconfig.json                  # TypeScript compiler configuration
├── vitest.config.js               # Vitest test runner configuration
└── README.md
```

---

# Requirements

Before starting, make sure you have:

- **Node.js** (v20.x or higher recommended)
- **npm** (v10.x or higher)
- **PostgreSQL** database instance

Optional:

- Google OAuth credentials
- GitHub OAuth credentials
- Resend API key (for email verification and password reset)

---

# Installation & Setup

### 1. Clone the template

```bash
git clone https://github.com/mukundsingh19/express-auth-api-template.git my-new-project
cd my-new-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the environment

Create your local environment file:

```bash
cp .env.example .env
```

Configure the required environment variables in `.env`.

### 4. Setup the Database

Generate the Prisma client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

---

# Available NPM Scripts

The following scripts are configured in `package.json`:

| Script                      | Command                                                                 | Description                                              |
| --------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| `npm run dev`               | `tsx watch src/server.ts`                                               | Start the development server with live TypeScript reload |
| `npm run build`             | `tsc`                                                                   | Compile TypeScript source files to the `./dist` folder   |
| `npm start`                 | `node dist/src/server.js`                                               | Run the compiled production server                       |
| `npm run typecheck`         | `tsc --noEmit`                                                          | Run static type checking without emitting files          |
| `npm test`                  | `vitest run`                                                            | Run the automated test suite                             |
| `npm run test:watch`        | `vitest`                                                                | Run tests in interactive watch mode                      |
| `npm run lint`              | `eslint .`                                                              | Lint all JavaScript and TypeScript files                 |
| `npm run lint:fix`          | `eslint . --fix`                                                        | Automatically fix linting issues                         |
| `npm run format`            | `prettier --write .`                                                    | Format all files using Prettier                          |
| `npm run format:check`      | `prettier --check .`                                                    | Verify formatting without modifying files                |
| `npm run db:generate`       | `prisma generate`                                                       | Generate the Prisma Client to `generated/prisma`         |
| `npm run db:migrate`        | `prisma migrate dev`                                                    | Apply migrations in development                          |
| `npm run db:migrate:deploy` | `prisma migrate deploy`                                                 | Apply pending migrations in production                   |
| `npm run db:studio`         | `prisma studio`                                                         | Open Prisma Studio database GUI                          |
| `npm run check`             | `npm run typecheck && npm run lint && npm run format:check && npm test` | Run full validation pipeline                             |

---

# Environment Configuration

Create your local environment file from `.env.example`.

## Required Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME"

CLIENT_URL="http://localhost:5173"
CLIENT_ORIGIN="http://localhost:5173"

JWT_ACCESS_SECRET="your-access-token-secret-must-be-at-least-32-characters-long"
JWT_REFRESH_SECRET="your-refresh-token-secret-must-be-at-least-32-characters-long"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

EMAIL_ENABLED=false
```

JWT secrets should be long, unpredictable values (minimum 32 characters) and should be different from one another.

## Email Configuration (Optional)

When `EMAIL_ENABLED=true`, the following variables are required:

```env
EMAIL_ENABLED=true
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="your-sender@example.com"
PASSWORD_RESET_URL="http://localhost:5173/reset-password"
EMAIL_CHANGE_URL="http://localhost:5173/change-email"
```

## OAuth Variables (Optional)

Google and GitHub authentication are optional:

### Google

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

### GitHub

```env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:3000/auth/github/callback"
```

If a provider is not configured, its Passport strategy is skipped automatically.

---

# Database Setup

The project uses PostgreSQL through Prisma.

Generate the Prisma client:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

For production deployments, apply migrations using:

```bash
npm run db:migrate:deploy
```

---

# Running the Application

### Development Mode

Start the development server with hot-reloading:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

### Production Build & Run

1. Compile TypeScript:

```bash
npm run build
```

2. Start the production server:

```bash
npm start
```

### Health Check

Verify that the server is up and running:

```http
GET /health
```

Response:

```json
{
  "success": true,
  "message": "API is running."
}
```

---

# Testing

The project includes integration and unit tests using Vitest and Supertest.

Tests use a dedicated `.env.test` environment file.

Run all tests:

```bash
npm test
```

Run a specific test file:

```bash
npm test -- tests/auth/login.test.js
```

---

# Code Quality

Run type checking:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

Run full validation:

```bash
npm run check
```

---

# API Reference

All authentication and account-management endpoints are grouped into two primary route namespaces:

```text
/auth
/users
```

Authentication state is maintained through secure HTTP-only cookies.

---

## Authentication Endpoints

### `POST /auth/register`

Creates a new user account.

#### Request

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

#### Response

```json
{
  "success": true,
  "message": "Registration successful. Please verify your email address.",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": null,
    "avatarUrl": null,
    "emailVerifiedAt": null
  }
}
```

---

### `POST /auth/login`

Authenticates a verified user. Sets `accessToken` and `refreshToken` HTTP-only cookies.

#### Request

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123!"
}
```

---

### `POST /auth/logout`

Logs the current session out and clears authentication cookies.

---

### `POST /auth/refresh`

Rotates the current refresh token and issues a new access token via cookies.

---

### `GET /auth/me`

Returns the currently authenticated user profile. Requires authentication.

---

### `POST /auth/email/verify`

Verifies a user's email address using a 6-digit verification code.

```json
{
  "email": "john@example.com",
  "code": "123456"
}
```

---

### `POST /auth/email/resend`

Requests a new verification email code.

```json
{
  "email": "john@example.com"
}
```

---

### `POST /auth/password/forgot`

Requests a password reset link.

```json
{
  "email": "john@example.com"
}
```

---

### `POST /auth/password/reset`

Resets a user's password using a valid reset token. Invalids all active user sessions.

```json
{
  "token": "reset-token",
  "newPassword": "NewStrongPassword123!"
}
```

---

## User Account Management

All user-management endpoints require authentication.

### `PATCH /users/me`

Updates the authenticated user's display name or avatar URL.

```json
{
  "displayName": "John Doe",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

---

### `PATCH /users/me/password`

Changes the user's password and revokes all active sessions.

```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!"
}
```

---

### `PATCH /users/me/username`

Updates the username.

```json
{
  "username": "newusername"
}
```

---

### `PATCH /users/me/email`

Requests an email address change. Sends a confirmation link to the new address.

```json
{
  "email": "new@example.com"
}
```

---

### `POST /users/me/email/confirm`

Confirms an email address change with the token sent to the new email.

```json
{
  "token": "email-change-token"
}
```

---

### `DELETE /users/me`

Permanently deletes the authenticated user's account and clears cookies.

```json
{
  "currentPassword": "CurrentPassword123!"
}
```

---

## OAuth Endpoints

### Google OAuth

- `GET /auth/google`: Initiates Google authentication
- `GET /auth/google/authorize`: Starts provider authorization with state cookie verification
- `GET /auth/google/callback`: Handles Google callback and sets authentication cookies

### GitHub OAuth

- `GET /auth/github`: Initiates GitHub authentication
- `GET /auth/github/authorize`: Starts provider authorization with state cookie verification
- `GET /auth/github/callback`: Handles GitHub callback and sets authentication cookies

---

# Rate Limiting

| Operation                 |     Window | Limit |
| ------------------------- | ---------: | ----: |
| Login                     | 15 minutes |    10 |
| Registration              |     1 hour |     5 |
| Refresh                   | 15 minutes |    20 |
| Email verification        | 15 minutes |    10 |
| Verification email resend |     1 hour |     5 |
| Password reset request    | 15 minutes |     5 |
| Password reset            | 15 minutes |     5 |

---

# License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## Author

**[Mukund Kumar](https://github.com/mukundsingh19)**

Built as a reusable, type-safe foundation for future full-stack applications and client projects.
