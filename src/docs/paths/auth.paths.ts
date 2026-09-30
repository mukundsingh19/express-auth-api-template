export const authPaths = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Register a new local user account',
      description:
        'Creates a new user with username, email, and password. If email verification is enabled, sends a 6-digit verification code to the registered email address.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed or invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        409: {
          description: 'Username or email already exists',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictErrorResponse',
              },
            },
          },
        },
        429: {
          description: 'Registration rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RateLimitErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Authenticate with email and password',
      description:
        'Validates credentials, verifies email status, creates a persistent session, and returns secure HTTP-only `accessToken` and `refreshToken` cookies.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful. HTTP-only auth cookies set.',
          headers: {
            'Set-Cookie': {
              schema: {
                type: 'string',
                example: 'accessToken=...; Path=/; HttpOnly; SameSite=Lax',
              },
              description: 'Sets accessToken and refreshToken cookies',
            },
          },
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials or unverified email',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
        429: {
          description: 'Login rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RateLimitErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/me': {
    get: {
      tags: ['Auth'],
      summary: 'Get currently authenticated user',
      description:
        'Returns the profile of the user associated with the provided `accessToken` cookie.',
      security: [
        {
          cookieAccessTokenAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Authenticated user profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GetMeResponse',
              },
            },
          },
        },
        401: {
          description: 'Missing, invalid, or expired access token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/refresh': {
    post: {
      tags: ['Auth'],
      summary: 'Rotate refresh token and issue new access token',
      description:
        'Validates the `refreshToken` cookie, rotates the stored token hash to prevent replay attacks, and issues a new access token and rotated refresh token via cookies.',
      security: [
        {
          cookieRefreshTokenAuth: [],
        },
      ],
      responses: {
        200: {
          description: 'Token refreshed and rotated successfully',
          headers: {
            'Set-Cookie': {
              schema: {
                type: 'string',
              },
              description: 'Updated accessToken and new rotated refreshToken cookies',
            },
          },
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        401: {
          description: 'Missing, invalid, expired, or reused refresh token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
        429: {
          description: 'Refresh rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RateLimitErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/logout': {
    post: {
      tags: ['Auth'],
      summary: 'Logout active session',
      description:
        'Revokes the current server-side session and clears the `accessToken` and `refreshToken` cookies from the browser.',
      responses: {
        204: {
          description: 'Logged out successfully. Cookies cleared.',
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/email/verify': {
    post: {
      tags: ['Email Verification'],
      summary: 'Verify account email with code',
      description:
        'Validates the 6-digit cryptographic verification code and marks the account as verified.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/VerifyEmailRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email verified successfully or already verified',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid or expired verification code, or malformed input',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        429: {
          description: 'Email verification rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RateLimitErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/email/resend': {
    post: {
      tags: ['Email Verification'],
      summary: 'Resend email verification code',
      description:
        'Generates and emails a new verification code if the account exists and is unverified. Returns a generic success response to prevent account enumeration.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResendEmailVerificationRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description:
            'Generic response: If the email can be verified, a verification email will be sent.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        429: {
          description: 'Resend rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RateLimitErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/password/forgot': {
    post: {
      tags: ['Password Reset'],
      summary: 'Request password reset email',
      description:
        'Sends a password reset link with a secure token to the provided email address if an account exists. Returns a generic response.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ForgotPasswordRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description:
            'Generic response: If an account exists, a password reset email will be sent.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        429: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RateLimitErrorResponse',
              },
            },
          },
        },
        503: {
          description: 'Password reset unavailable because email functionality is disabled',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ServiceUnavailableErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/password/reset': {
    post: {
      tags: ['Password Reset'],
      summary: 'Reset password with reset token',
      description:
        'Consumes the reset token, updates the password hash, and revokes all active sessions for the user.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResetPasswordRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password reset successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid/expired token or password validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        429: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RateLimitErrorResponse',
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/InternalServerErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/google': {
    get: {
      tags: ['OAuth'],
      summary: 'Initiate Google OAuth flow',
      description:
        'Generates a cryptographically secure random OAuth state, sets it in an HTTP-only `oauthState` cookie, and redirects to `/auth/google/authorize`.',
      responses: {
        302: {
          description: 'Redirects to `/auth/google/authorize` with state cookie',
          headers: {
            Location: {
              schema: {
                type: 'string',
                example: '/auth/google/authorize',
              },
            },
            'Set-Cookie': {
              schema: {
                type: 'string',
                example: 'oauthState=...; Path=/auth; HttpOnly',
              },
            },
          },
        },
      },
    },
  },

  '/auth/google/authorize': {
    get: {
      tags: ['OAuth'],
      summary: 'Redirect to Google OAuth consent screen',
      description:
        'Validates that the browser contains a valid `oauthState` cookie before redirecting to Google.',
      security: [
        {
          cookieOAuthStateAuth: [],
        },
      ],
      responses: {
        302: {
          description: 'Redirects to Google consent screen (accounts.google.com)',
        },
        401: {
          description: 'Missing or invalid OAuth state cookie',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/google/callback': {
    get: {
      tags: ['OAuth'],
      summary: 'Google OAuth callback handler',
      description:
        'Verifies the incoming OAuth state against the stored cookie, processes Google profile, creates/links user, issues session tokens in cookies, and redirects to frontend client URL.',
      parameters: [
        {
          name: 'state',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'OAuth state parameter returned by Google',
        },
        {
          name: 'code',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'OAuth authorization code returned by Google',
        },
      ],
      security: [
        {
          cookieOAuthStateAuth: [],
        },
      ],
      responses: {
        302: {
          description: 'Redirects to configured `CLIENT_URL` with auth cookies',
        },
        401: {
          description: 'OAuth authentication failed or state mismatch',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/github': {
    get: {
      tags: ['OAuth'],
      summary: 'Initiate GitHub OAuth flow',
      description:
        'Generates a cryptographically secure random OAuth state, sets it in an HTTP-only `oauthState` cookie, and redirects to `/auth/github/authorize`.',
      responses: {
        302: {
          description: 'Redirects to `/auth/github/authorize` with state cookie',
          headers: {
            Location: {
              schema: {
                type: 'string',
                example: '/auth/github/authorize',
              },
            },
            'Set-Cookie': {
              schema: {
                type: 'string',
                example: 'oauthState=...; Path=/auth; HttpOnly',
              },
            },
          },
        },
      },
    },
  },

  '/auth/github/authorize': {
    get: {
      tags: ['OAuth'],
      summary: 'Redirect to GitHub OAuth consent screen',
      description:
        'Validates that the browser contains a valid `oauthState` cookie before redirecting to GitHub.',
      security: [
        {
          cookieOAuthStateAuth: [],
        },
      ],
      responses: {
        302: {
          description: 'Redirects to GitHub consent screen (github.com/login/oauth/authorize)',
        },
        401: {
          description: 'Missing or invalid OAuth state cookie',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
      },
    },
  },

  '/auth/github/callback': {
    get: {
      tags: ['OAuth'],
      summary: 'GitHub OAuth callback handler',
      description:
        'Verifies the incoming OAuth state against the stored cookie, processes GitHub profile, creates/links user, issues session tokens in cookies, and redirects to frontend client URL.',
      parameters: [
        {
          name: 'state',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'OAuth state parameter returned by GitHub',
        },
        {
          name: 'code',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'OAuth authorization code returned by GitHub',
        },
      ],
      security: [
        {
          cookieOAuthStateAuth: [],
        },
      ],
      responses: {
        302: {
          description: 'Redirects to configured `CLIENT_URL` with auth cookies',
        },
        401: {
          description: 'OAuth authentication failed or state mismatch',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
      },
    },
  },
};
