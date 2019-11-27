module.exports = {
  '/users': {
    post: {
      tags: ['CRUD operations'],
      description: 'Sign up',
      operationId: 'signUp',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserWithPassword'
            }
          }
        },
        required: true
      },
      responses: {
        200: {
          description: 'User´s name',
          content: {
            'application/json': {
              example: {
                firstName: 'Oscar'
              }
            }
          }
        },
        400: {
          description: 'Existing user',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'User´s email already exists',
                internal_code: 'email_already_in_use'
              }
            }
          }
        }
      }
    }
  }
};
