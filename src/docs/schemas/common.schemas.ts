export const commonSchemas = {
  SuccessMessageResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Operation completed successfully.',
      },
    },
    required: ['success', 'message'],
  },
  HealthResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'API is running.',
      },
    },
    required: ['success', 'message'],
  },
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
      },
      username: {
        type: 'string',
        example: 'johndoe',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'john.doe@example.com',
      },
      displayName: {
        type: 'string',
        nullable: true,
        example: 'John Doe',
      },
      avatarUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://example.com/avatars/johndoe.png',
      },
      emailVerifiedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2026-09-30T10:00:00.000Z',
      },
    },
    required: ['id', 'username', 'email'],
  },
};
