export const userPaths = {
  '/users/me': {
    patch: {
      tags: ['Users'],
      summary: 'Update authenticated user profile',
      description:
        'Updates partial profile attributes such as display name and avatar URL. At least one field must be provided.',
      security: [
        {
          cookieAccessTokenAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateProfileRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Profile updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateProfileResponse',
              },
            },
          },
        },
        400: {
          description: 'Validation failed or no fields provided',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - invalid or missing accessToken cookie',
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

    delete: {
      tags: ['Users'],
      summary: 'Delete user account',
      description:
        'Permanently deletes the authenticated user account, associated sessions, accounts, and verification tokens. Clears auth cookies.',
      security: [
        {
          cookieAccessTokenAuth: [],
        },
      ],
      requestBody: {
        required: false,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/DeleteAccountRequest',
            },
          },
        },
      },
      responses: {
        204: {
          description: 'Account deleted successfully. Auth cookies cleared.',
        },
        400: {
          description: 'Missing current password for local account',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized or incorrect current password',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NotFoundErrorResponse',
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

  '/users/me/password': {
    patch: {
      tags: ['Users'],
      summary: 'Change account password',
      description:
        'Validates current password, updates to new password hash, and revokes all other active sessions for the user.',
      security: [
        {
          cookieAccessTokenAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ChangePasswordRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Password changed successfully. User must log in again.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'New password same as old password or invalid input',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Current password incorrect or unauthorized',
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

  '/users/me/username': {
    patch: {
      tags: ['Users'],
      summary: 'Change account username',
      description:
        'Updates the username for the authenticated account after verifying availability.',
      security: [
        {
          cookieAccessTokenAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ChangeUsernameRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Username updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ChangeUsernameResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid username format',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
        409: {
          description: 'Username is already taken',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictErrorResponse',
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

  '/users/me/email': {
    patch: {
      tags: ['Users'],
      summary: 'Request email address change',
      description:
        'Initiates an email change flow by sending a confirmation link to the requested new email address.',
      security: [
        {
          cookieAccessTokenAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RequestEmailChangeRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Verification email sent if eligible',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'New email identical to current email or invalid format',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
        409: {
          description: 'Email is already registered by another account',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictErrorResponse',
              },
            },
          },
        },
        503: {
          description: 'Email change unavailable because email functionality is disabled',
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

  '/users/me/email/confirm': {
    post: {
      tags: ['Users'],
      summary: 'Confirm email address change with token',
      description:
        'Consumes the email change token and atomically updates the user email address and marks it as verified.',
      security: [
        {
          cookieAccessTokenAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ConfirmEmailChangeRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email address changed successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessMessageResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid or expired email change token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationErrorResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UnauthorizedErrorResponse',
              },
            },
          },
        },
        409: {
          description: 'Email address was taken before confirmation',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ConflictErrorResponse',
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
};
