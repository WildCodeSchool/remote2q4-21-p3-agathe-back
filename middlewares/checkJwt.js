const jwt = require('jsonwebtoken');
const User = require('../models/users')

require('dotenv').config();

const checkJwt = async(req, res, next) => {
    try {
        const { cookies } = req;

        // Check if the JWT is present in the request's cookies
        if (!cookies || !cookies.user_token) {
            return res.status(401).json({ message: 'Missing token in cookie' });
        }

        // Check and decode the token
        const decodedToken = jwt.verify(cookies.user_token, process.env.JWT_SECRET);

        // Check if user exists
        const { email } = decodedToken;
        const [
            [user]
        ] = await User.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: `User ${email} not exists`
            });
        }

        // Pass the user in the request to access it in other middleware
        req.user = user;

        return next(); // call next middleware
    } catch (err) {
        return res.status(401).json();
    }
};

const isAdmin = (req, res, next) => {
    try {
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                message: `User not exists`
            });
        } else if (!req.user.is_admin) {
            return res.status(403).json({
                message: `User is not admin`
            });
        }
        return next(); // call next middleware
    } catch (err) {
        return res.status(401).json();
    }
};

// const checkJwt_old = (req, res, next) => {
//     if (!req.headers.authorization) {
//         res.status(401).json();
//     }
//     try {
//         jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
//         return next();
//     } catch (err) {
//         return res.status(401).json();
//     }
// };

module.exports = {
    checkJwt,
    isAdmin
}