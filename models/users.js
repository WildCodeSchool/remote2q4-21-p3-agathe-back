const connection = require('../db-config');

const db = connection.promise();

const count = () =>
    db
    .query('SELECT count(*) as count FROM users')
    .then(([results]) => results[0]);

const findMany = () =>
    db
    .query('SELECT id, email, first_name, last_name, phone_number, address_1, address_2, address_3, post_code, city FROM users')
    .then(([results]) => results);

const findOne = (id) =>
    db
    .query('SELECT id, email, first_name, last_name, phone_number, address_1, address_2, address_3, post_code, city, is_admin FROM users WHERE id=?', [id])
    .then(([results]) => results[0]);

const findUserByEmail = (email) =>
    db
    .query('SELECT * FROM users WHERE email=?', [email]);

const insertUser = (email, password, first_name, last_name, phone_number,
        address_1, address_2, address_3, post_code, city) =>
    db
    .query('INSERT INTO users (email, password, first_name, last_name, phone_number,\
         address_1, address_2, address_3, post_code, city) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [email, password, first_name, last_name, phone_number, address_1, address_2, address_3, post_code, city]);

const updateUser = ({
        id,
        email,
        first_name,
        last_name,
        phone_number,
        address_1,
        address_2,
        address_3,
        post_code,
        city
    }) =>
    db
    .query('UPDATE users set email=?, first_name=?, last_name=?, phone_number=?,\
             address_1=?, address_2=?, address_3=?, post_code=?, city=? \
            WHERE id=?', [email, first_name, last_name, phone_number, address_1, address_2, address_3, post_code, city, id]);

const authenticate = (email, password) =>
    db
    .query('SELECT id, first_name, last_name, email, is_admin FROM users WHERE email=? and password=?', [email, password]);

// const hashingOptions = {
//     type: argon2.argon2id,
//     memoryCost: 2 ** 16,
//     timeCost: 5,
//     parallelism: 1,
// };

const hashPassword = (plainPassword) => {
    return (plainPassword);
};

const verifyPassword = (plainPassword, hashedPassword) => {
    if(plainPassword===hashedPassword)
        return true;
     else
        return false; 
};

module.exports = {
    count,
    findOne,
    findMany,
    findUserByEmail,
    insertUser,
    updateUser,
    authenticate,
    hashPassword,
    verifyPassword,
};