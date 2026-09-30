import { env } from '../config/env.js';

export const openApiConfig = {
  openapi: '3.0.3',
  info: {
    title: 'Express Auth API Template',
    version: '1.0.0',
    description: `A production-oriented, type-safe authentication and user-management REST API template.
    
### Key Features
- **Local & OAuth Authentication**: Username/password, Google OAuth 2.0, GitHub OAuth.
- **Session & Token Management**: Short-lived JWT access tokens and long-lived rotating refresh tokens stored in secure HTTP-only cookies.
- **Email Workflows**: Cryptographic OTP email verification, email address change confirmation, and password reset flows (powered by Resend).
- **Security First**: Bcrypt password hashing, timing-safe OAuth state validation, per-endpoint rate limiting, and Zod input validation.

### Authentication in Swagger UI
This API uses secure **HTTP-only cookies** for authentication:
- \`accessToken\`: Used for authenticated API routes under \`/auth/me\` and \`/users/*\`.
- \`refreshToken\`: Used for token rotation at \`/auth/refresh\`.
- \`oauthState\`: Used during OAuth handshakes at \`/auth/google/callback\` and \`/auth/github/callback\`.

**How to test with "Try it out":**
1. Execute \`POST /auth/login\` with valid credentials.
2. The server responds with \`Set-Cookie\` headers containing the \`accessToken\` and \`refreshToken\`.
3. Because Swagger UI is configured with \`withCredentials: true\`, the browser automatically attaches these cookies to subsequent requests (such as \`GET /auth/me\` or \`PATCH /users/me\`).
4. You can also explicitly inspect or manage these cookies in your browser dev tools.`,
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
    contact: {
      name: 'API Support',
      url: 'https://github.com/mukundsingh19/express-auth-api-template',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
      description: 'Local Development Server',
    },
    {
      url: env.CLIENT_ORIGIN,
      description: 'Configured Client Origin Server',
    },
  ],
  tags: [
    {
      name: 'Health',
      description: 'API health status and server diagnostics',
    },
    {
      name: 'Auth',
      description: 'Registration, login, logout, token refresh, and identity retrieval',
    },
    {
      name: 'Email Verification',
      description: 'Account email verification code issuance and confirmation',
    },
    {
      name: 'Password Reset',
      description: 'Password recovery and reset flows',
    },
    {
      name: 'OAuth',
      description: 'Third-party social authentication with Google and GitHub',
    },
    {
      name: 'Users',
      description: 'Authenticated user profile, credentials, and account lifecycle management',
    },
  ],
  components: {
    securitySchemes: {
      cookieAccessTokenAuth: {
        type: 'apiKey' as const,
        in: 'cookie' as const,
        name: 'accessToken',
        description: 'JWT Access Token passed in the `accessToken` HTTP-only cookie',
      },
      cookieRefreshTokenAuth: {
        type: 'apiKey' as const,
        in: 'cookie' as const,
        name: 'refreshToken',
        description: 'JWT Refresh Token passed in the `refreshToken` HTTP-only cookie',
      },
      cookieOAuthStateAuth: {
        type: 'apiKey' as const,
        in: 'cookie' as const,
        name: 'oauthState',
        description: 'Cryptographic state token passed in the `oauthState` HTTP-only cookie',
      },
    },
  },
};
