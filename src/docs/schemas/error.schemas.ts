export const errorSchemas = {
  ValidationErrorDetail: {
    type: 'object',
    properties: {
      field: {
        type: 'string',
        example: 'email',
      },
      message: {
        type: 'string',
        example: 'Please provide a valid email address.',
      },
    },
    required: ['field', 'message'],
  },
  ValidationErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'VALIDATION_ERROR',
          },
          message: {
            type: 'string',
            example: 'Request validation failed.',
          },
          details: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ValidationErrorDetail',
            },
          },
        },
        required: ['code', 'message', 'details'],
      },
    },
    required: ['success', 'error'],
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'AUTHENTICATION_REQUIRED',
          },
          message: {
            type: 'string',
            example: 'Authentication required.',
          },
        },
        required: ['code', 'message'],
      },
    },
    required: ['success', 'error'],
  },
  UnauthorizedErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'AUTHENTICATION_REQUIRED',
          },
          message: {
            type: 'string',
            example: 'Authentication required.',
          },
        },
        required: ['code', 'message'],
      },
    },
    required: ['success', 'error'],
  },
  NotFoundErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'USER_NOT_FOUND',
          },
          message: {
            type: 'string',
            example: 'User not found.',
          },
        },
        required: ['code', 'message'],
      },
    },
    required: ['success', 'error'],
  },
  ConflictErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'EMAIL_ALREADY_EXISTS',
          },
          message: {
            type: 'string',
            example: 'Email is already registered.',
          },
        },
        required: ['code', 'message'],
      },
    },
    required: ['success', 'error'],
  },
  RateLimitErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'RATE_LIMIT_EXCEEDED',
          },
          message: {
            type: 'string',
            example: 'Too many login attempts. Please try again later.',
          },
        },
        required: ['code', 'message'],
      },
    },
    required: ['success', 'error'],
  },
  InternalServerErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'INTERNAL_ERROR',
          },
          message: {
            type: 'string',
            example: 'An unexpected error occurred.',
          },
        },
        required: ['code', 'message'],
      },
    },
    required: ['success', 'error'],
  },
  ServiceUnavailableErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            example: 'EMAIL_FEATURE_DISABLED',
          },
          message: {
            type: 'string',
            example: 'Password reset is unavailable because email functionality is disabled.',
          },
        },
        required: ['code', 'message'],
      },
    },
    required: ['success', 'error'],
  },
};
