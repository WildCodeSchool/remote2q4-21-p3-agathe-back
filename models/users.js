const connection = require('../db-config');
const argon2 = require("argon2");

const db = connection.promise();

const findOne = (id) =>
    db
    .query('SELECT * FROM users WHERE id=?', [id])
    .then(([results]) => results[0]);

const findUserByEmail = (email) =>
    db
    .query('SELECT * FROM users WHERE email=?', [email]);

const insertUser = (email, password, FirstName, LastName, PhoneNumber,
        Address1, Address2, Address3, postCode, city) =>
    db
    .query('INSERT INTO users (email, password, FirstName, LastName, PhoneNumber,\
         Address1, Address2, Address3, postCode, city) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [email, password, FirstName, LastName, PhoneNumber, Address1, Address2, Address3, postCode, city]);

const updateUser = ({
        id,
        email,
        password,
        FirstName,
        LastName,
        PhoneNumber,
        Address1,
        Address2,
        Address3,
        postCode,
        city
    }) =>
    db
    .query('UPDATE users set (email=?, password=?, FirstName=?, LastName=?, PhoneNumber=?,\
             Address1=?, Address2=?, Address3=?, postCode=?, city=?) \
            WHERE id=?', [email, password, FirstName, LastName, PhoneNumber, Address1, Address2, Address3, postCode, city, id]);

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
    return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};

module.exports = {
    findUserByEmail,
    insertUser,
    updateUser,
    authenticate,
    hashPassword,
    verifyPassword,
};