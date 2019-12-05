const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.EXTERNAL_API_ERROR = 'external_API_error';
exports.externalApiError = message => internalError(message, exports.EXTERNAL_API_ERROR);

exports.EMAIL_IN_USE_ERROR = 'email_already_in_use';
exports.emailInUseError = message => internalError(message, exports.EMAIL_IN_USE_ERROR);

exports.EMAIL_ERROR = 'invalid_email';
exports.emailError = message => internalError(message, exports.EMAIL_ERROR);

exports.PASSWORD_ERROR = 'invalid_password';
exports.passwordError = message => internalError(message, exports.PASSWORD_ERROR);

exports.INVALID_CREDENTIALS = 'invalid_credentials';
exports.invalidCredentials = message => internalError(message, exports.INVALID_CREDENTIALS);

exports.INVALID_TOKEN = 'invalid_token';
exports.invalidToken = message => internalError(message, exports.INVALID_TOKEN);
