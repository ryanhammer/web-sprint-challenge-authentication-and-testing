const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');
const { 
  checkForRequiredCredentials,
  validateUsername,
  validateLogin,
  tokenBuilder
  } = require('../middleware/auth-middleware');

router.post(
  '/register',
  checkForRequiredCredentials,
  validateUsername,
  (req, res, next) => {
    let user = req.body;

    const hashRounds = process.env.BCRYPT_ROUNDS || 8;
    const hashedPassword = bcrypt.hashSync(user.password, hashRounds);
  
    user.password = hashedPassword;
  
    Users.addUser(user)
      .then(savedUser => {
        res.status(201).json(savedUser);
      })
      .catch(next);
  
  }
);

router.post(
  '/login',
  checkForRequiredCredentials,
  validateLogin,
  tokenBuilder,
  (req, res) => {
    const token = req.token;
    res.status(200).json({
      message: `welcome ${req.user.username}`,
      token
    });

});

module.exports = router;
