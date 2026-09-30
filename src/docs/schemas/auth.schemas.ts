export const authSchemas = {
  RegisterRequest: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        pattern: '^[a-zA-Z0-9_]+$',
        description: 'Alphanumeric username with underscores allowed',
        example: 'johndoe',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Valid unique email address',
        example: 'john.doe@example.com',
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
        format: 'password',
        description: 'Password between 8 and 128 characters',
        example: 'StrongPassword123!',
      },
    },
    required: ['username', 'email', 'password'],
  },
  RegisterResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Registration successful. Please verify your email address.',
      },
      user: {
        $ref: '#/components/schemas/User',
      },
    },
    required: ['success', 'message', 'user'],
  },
  LoginRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'john.doe@example.com',
      },
      password: {
        type: 'string',
        format: 'password',
        minLength: 1,
        example: 'StrongPassword123!',
      },
    },
    required: ['email', 'password'],
  },
  LoginResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Login successful.',
      },
      user: {
        $ref: '#/components/schemas/User',
      },
    },
    required: ['success', 'message', 'user'],
  },
  GetMeResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      user: {
        $ref: '#/components/schemas/User',
      },
    },
    required: ['success', 'user'],
  },
  VerifyEmailRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'john.doe@example.com',
      },
      code: {
        type: 'string',
        pattern: '^\\d{6}$',
        description: '6-digit numeric verification code',
        example: '123456',
      },
    },
    required: ['email', 'code'],
  },
  ResendEmailVerificationRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'john.doe@example.com',
      },
    },
    required: ['email'],
  },
  ForgotPasswordRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'john.doe@example.com',
      },
    },
    required: ['email'],
  },
  ResetPasswordRequest: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Password reset token received via email',
        example: 'c1b48b7a6e138a0f6797a7e8e52e4d0d',
      },
      newPassword: {
        type: 'string',
        format: 'password',
        minLength: 8,
        maxLength: 128,
        example: 'NewStrongPassword123!',
      },
    },
    required: ['token', 'newPassword'],
  },
};
