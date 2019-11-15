// eslint-disable-next-line no-empty-function
const models = require('../models/index');

module.exports.sign_up = (req, res) => {
  models.users.create({
    firstName: 'Roberto',
    lastName: 'Gonzalez',
    email: 'email@email.com',
    password: 'pass'
  });
  res.send({
    menssage: 'Esta ruta es de prueba en mi api restful con mongo y node'
  });
};

// ¿Por qué queda colgado el postman al hace esta petición?
// ¿Cómo accedo al cuerpo de las peticiones GET o POST en los controladores?
