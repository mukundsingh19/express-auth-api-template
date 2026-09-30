export const userSchemas = {
  UpdateProfileRequest: {
    type: 'object',
    properties: {
      displayName: {
        type: 'string',
        maxLength: 100,
        nullable: true,
        example: 'John Doe',
      },
      avatarUrl: {
        type: 'string',
        format: 'uri',
        maxLength: 2048,
        nullable: true,
        example: 'https://example.com/avatars/newavatar.png',
      },
    },
    description: 'Provide at least one profile field to update',
  },
  UpdateProfileResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Profile updated successfully.',
      },
      user: {
        $ref: '#/components/schemas/User',
      },
    },
    required: ['success', 'message', 'user'],
  },
  ChangePasswordRequest: {
    type: 'object',
    properties: {
      currentPassword: {
        type: 'string',
        format: 'password',
        example: 'StrongPassword123!',
      },
      newPassword: {
        type: 'string',
        format: 'password',
        minLength: 8,
        maxLength: 128,
        example: 'BrandNewPassword456!',
      },
    },
    required: ['currentPassword', 'newPassword'],
  },
  ChangeUsernameRequest: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        pattern: '^[a-zA-Z0-9_]+$',
        example: 'new_username99',
      },
    },
    required: ['username'],
  },
  ChangeUsernameResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Username updated successfully.',
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
          },
          username: {
            type: 'string',
            example: 'new_username99',
          },
        },
        required: ['id', 'username'],
      },
    },
    required: ['success', 'message', 'user'],
  },
  RequestEmailChangeRequest: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'new.email@example.com',
      },
    },
    required: ['email'],
  },
  ConfirmEmailChangeRequest: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Email change confirmation token received via email',
        example: 'd9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4',
      },
    },
    required: ['token'],
  },
  DeleteAccountRequest: {
    type: 'object',
    properties: {
      currentPassword: {
        type: 'string',
        format: 'password',
        description: 'Required for password-based local accounts; omitted for OAuth-only accounts',
        example: 'StrongPassword123!',
      },
    },
  },
};
