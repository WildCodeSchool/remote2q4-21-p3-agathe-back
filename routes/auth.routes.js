const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authRouter = require("express").Router();
// const { calculateJWTToken } = require('../helpers/users');
const { generateJWT, decodeJWT } = require('../utils/auth')
    //const { User, RefreshToken } = require('./models');
const User = require('../models/users');
// const config = require('./config');

authRouter.post('/login', async(req, res, next) => {
    try {
        /* 1. On récupère le mail de l'utilisateur et le mot de passe dans la requête */
        const { email, password } = req.body;

        /* 2. On envoie une erreur au client si le paramètre username est manquant */
        if (!email) {
            return res.status(400).json({ message: 'missing_required_parameter', info: 'email' });
        }
        /* 3. On envoie une erreur au client si le paramètre password est manquant */
        if (!password) {
            return res.status(400).json({ message: 'missing_required_parameter', info: 'password' });
        }

        /* 4. On authentifie l'utilisateur */
        User.findUserByEmail(email)
            .then(([
                [user]
            ]) => {
                /* 5. On envoie une erreur au client si les informations de connexion sont erronées */
                if (!user) res.status(401).send('Invalid credentials')
                else {
                    User.verifyPassword(password, user.password)
                        .then(passwordIsCorrect => {
                            if (passwordIsCorrect) {
                                /* 6. On créer le JWT */
                                // const token = calculateJWTToken(user);
                                const token = generateJWT(user.email, user.IsAdmin);
                                let date = new Date();
                                date.setTime(date.getTime() + (60 * 60 * 1000)); // expires in 1 hour
                                res.cookie("user_token", token, { expires: date, httpOnly: true }); //, secure: true }); HTTPS ONLY
                                res.send();
                                // res.json({ credentials: token });
                            } else res.status(401).send('Invalid credentials');
                        })
                }
            })

        /* 7. On créer le refresh token et on le stocke en BDD */
        // const refreshToken = crypto.randomBytes(128).toString('base64');

        // await RefreshToken.create({
        //   userId: user.id,
        //   token: refreshToken,
        //   expiresAt: Date.now() + config.refreshToken.expiresIn
        // });

        /* 7. On envoie au client le JWT et le refresh token */
        // return res.json({
        //     accessToken,
        //     tokenType: config.accessToken.type,
        //     accessTokenExpiresIn: config.accessToken.expiresIn,
        //     refreshToken,
        //     refreshTokenExpiresIn: config.refreshToken.expiresIn
        // });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});

authRouter.get('/admin', async(req, res, next) => {
    try {
        const { cookies } = req;
        // Check if the JWT is present in the request's cookies
        if (!cookies || !cookies.user_token) {
            return res.status(401).json({ message: 'Missing token in cookie' });
        }
        const user_token = decodeJWT(cookies.user_token);
        if (user_token.is_admin) {
            return res.status(202).json({ message: '' }) // Accepted
        } else {
            res.status(403).json({ message: '' }) // Forbidden
        }
    } catch (err) {
        console.log('error')
        console.log(err)
    }
});

module.exports = authRouter;