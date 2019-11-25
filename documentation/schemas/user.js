module.exports = {
  firstName: {
    type: 'string',
    example: 'Thomas'
  },
  lastName: {
    type: 'string',
    example: 'Schmidt'
  },
  email: {
    type: 'string',
    example: 'thomas-schmidt@gmail.com'
  },
  User: {
    type: 'object',
    properties: {
      firstName: {
        $ref: '#/components/schemas/firstName'
      },
      lastName: {
        $ref: '#/components/schemas/lastName'
      },
      email: {
        $ref: '#/components/schemas/email'
      }
    }
  },
  UserWithPassword: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        example: 'password1039'
      }
    },
    allOf: [
      {
        $ref: '#/components/schemas/User'
      }
    ]
  },
  Users: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User'
        }
      }
    }
  }
};
