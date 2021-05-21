const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../auth/secrets');
const db = require('../../data/dbConfig');

const findUser = (filter) => {
  return db('users')
    .where(filter);
}

const checkForRequiredCredentials = (req, res, next) => {
  const { username, password } = req.body;
  const valid = Boolean(username.trim() && password.trim());

  if (valid) {
    req.body.username = username.trim();
    req.body.password = password.trim();
    next();
  } else {
    res.status(422).json({
      message: 'username and password required'
    });
  }
}

const validateUsername = (req, res, next) => {

  findUser(req.body.username)
    .then(([user]) => {
      if (!user) {
        next();
      } else {
        res.status(409).json({
            message: "username taken"
        });
      }
    })
    .catch(err => {
      next(err);
    })
};

module.exports = { checkForRequiredCredentials, validateUsername };