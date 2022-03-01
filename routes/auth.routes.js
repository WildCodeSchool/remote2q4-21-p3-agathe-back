const jwt = require('jsonwebtoken');
const authRouter = require("express").Router();
const { calculateJWTToken } = require('../helpers/users');
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
                    console.log(`user: ${user}`)
                    User.verifyPassword(password, user.password)
                        .then(passwordIsCorrect => {
                            if (passwordIsCorrect) {
                                /* 6. On créer le JWT */
                                const token = calculateJWTToken(user);
                                res.cookie("user_token", token, { httpOnly: true, secure: true });
                                res.send();
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

module.exports = authRouter;