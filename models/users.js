const connection = require('../db-config');

const db = connection.promise();

const findUserByEmail = (email) =>
    db
    .query('SELECT * FROM users WHERE email=?', [email]);

const insertUser = (email, password, role) =>
    db
    .query('INSERT INTO users (`email`, `password`, `role`) VALUES (?, ?, ?)', [email, password, role]);

const authenticate = (email, password) =>
    db
    .query('SELECT id, firstname, lastname, email, isAdmin FROM users WHERE email=? and password=?', [email, password]);

module.exports = {
    findUserByEmail,
    insertUser,
    authenticate
};