const db = require('../../data/dbConfig');

const findUser = (username) => {
  return db('users').where('username', username).first();
}

const findById =async (id) => {
  const user = await db('users').where('id', id).first();
  return user;
}

const addUser = async (user) => {
  const [id] = await db('users').insert(user, ['id', 'username', 'password']);
  return findById(id);
}

module.exports = { findUser, addUser };