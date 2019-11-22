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
  password: {
    type: 'string',
    example: 'password1039'
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
      },
      password: {
        $ref: '#/components/schemas/password'
      }
    }
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
