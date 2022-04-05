const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateJWT = (email, is_admin) => jwt.sign({
    email,
    is_admin
}, process.env.JWT_SECRET);

const decodeJWT = (token) => {
    return jwt.decode(token);
};

module.exports = {
    generateJWT,
    decodeJWT
};