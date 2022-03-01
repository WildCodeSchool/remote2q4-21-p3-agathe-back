const connection = require('../db-config');
const argon2 = require("argon2");

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

const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1,
};

const hashPassword = (plainPassword) => {
    return argon2.hash(plainPassword, hashingOptions);
};

const verifyPassword = (plainPassword, hashedPassword) => {
    console.log(`hashedPassword: ${hashedPassword}, plainPassword: ${plainPassword}`)
    return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};

module.exports = {
    findUserByEmail,
    insertUser,
    authenticate,
    hashPassword,
    verifyPassword,
};