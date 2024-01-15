const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');

const { JWT_SECRET = 'dev_key' } = process.env;

module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload;
  return next();
};
