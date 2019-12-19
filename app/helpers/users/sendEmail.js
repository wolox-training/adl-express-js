const nodemailer = require('nodemailer');
const configNodeMailer = require('../../../config').common.nodeMailer;
const logger = require('../../logger');

const mailer = nodemailer.createTransport(configNodeMailer);

const welcomeMailOptions = email => ({
  from: 'alanlamastrainingnode@wolox.com.ar',
  to: email,
  subject: 'Your account has been created',
  text: 'Your account has been created!'
});

module.exports.send = async email => {
  try {
    await mailer.sendMail(welcomeMailOptions(email));
  } catch (error) {
    logger.error(`An error occurs: ${JSON.stringify(error)}`);
    throw error;
  }
};
