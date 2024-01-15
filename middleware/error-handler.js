const { errors } = require('celebrate');
const {
  HTTP_STATUS_BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../constants/constants');

const celebrateErrorHandler = (err, _, res, next) => {
  if (errors.isCelebrateError(err)) {
    const errorMessage = errors.details.get(err.details, { prettify: true });
    return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: 'Validation Error', message: errorMessage });
  }
  return next(err);
};

const errorHandler = (err, _, res) => {
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
};

module.exports = {
  errorHandler,
  celebrateErrorHandler,
};
