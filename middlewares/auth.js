const { JWT_SECRET, NODE_ENV } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-errors');
const { secretKey } = require('../utils/config');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходимо авторизоваться'));
    return;
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : secretKey);
  } catch (err) {
    next(new UnauthorizedError('Необходимо авторизоваться'));
    return;
  }
  req.user = payload;
  next();
};
