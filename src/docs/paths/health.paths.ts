export const healthPaths = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Check API health status',
      description:
        'Returns a 200 OK status indicating that the application server is healthy and responsive.',
      responses: {
        200: {
          description: 'Server is healthy and running',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthResponse',
              },
            },
          },
        },
      },
    },
  },
};
