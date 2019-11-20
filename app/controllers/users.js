const models = require('../models/index');

module.exports.sign_up = (req, res, next) => {
  const first_user = models.users
    .findOne({ where: { email: req.body.email } })
    .then(user => user.dataValues)
    .then(dataValues => {
      console.log('--------------------------------------------------------------');
      console.log(dataValues);
      if (!dataValues) {
        models.users.create({
          firstName: 'Roberto',
          lastName: 'Gonzalez',
          email: 'email@email.com',
          password: 'pass'
        });
      }
    });
  console.log(first_user);
  res.send({
    menssage: 'Esta ruta es de prueba en mi api restful con mongo y node'
  });
};

module.exports.sign_up = (req, res, next) => {};
