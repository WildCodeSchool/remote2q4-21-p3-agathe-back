const router = require("express").Router();
const Joi = require('joi');
const argon2 = require('argon2');
const { generateJWT } = require('../utils/auth')
const checkJwt = require('../middlewares/checkJwt')
const Users = require('../models/users');

router.get('/', checkJwt, (req, res) =>
    Users.findMany()
    .then(users => res.json(result))
    .catch(err => {
        res.status(500).send('Error retrieving users from database');
    })
);

router.get('/:id', (req, res) =>
    Users.findOne(req.params.id)
    .then(user => {
        if (user.length) res.json(results[0]);
        else res.status(404).send('User not found');
    })
    .catch(err => {
        res.status(500).send('Error retrieving user from database');
    })
);

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    PhoneNumber: Joi.string().required(),
    Address1: Joi.string().required(),
    Address2: Joi.string().allow(null, ''),
    Address3: Joi.string().allow(null, ''),
    postCode: Joi.string().required(),
    city: Joi.string().required()
})

router.post('/', async(req, res) => {
    // recup donnees requete
    const { value, error } = userSchema.validate(req.body);
    if (error) {
        console.log(error)
        return res.status(400).json(error);
    }

    // verifie si user existe
    // await permet d'etre sur d'avoir un retour de verif user
    const [
        [existingUser]
    ] = await Users.findUserByEmail(value.email);
    if (existingUser) {
        return res.status(409).json({
            message: "l'utilisateur existe deja",
        })
    }

    // etape de l'encryptage
    const hashedPassword = await argon2.hash(value.password);

    await Users.insertUser(value.email, hashedPassword, value.FirstName, value.LastName,
        value.PhoneNumber, value.Address1, value.Address2, value.Address3,
        value.postCode, value.city);

    const jwtKey = generateJWT(value.email, 'ROLE_USER');
    return res.json({ credentials: jwtKey })

    // return res.json({
    //     message: "l'utilisateur a bien ete cree"
    // })

})

// router.put('/:id', (req, res) => {
//     const userId = req.params.id;
//     const db = connection.promise();
//     let existingUser = null;
//     db.query('SELECT * FROM users WHERE id = ?', [userId])
//         .then(([results]) => {
//             existingUser = results[0];
//             if (!existingUser) return Promise.reject('RECORD_NOT_FOUND');
//             return db.query('UPDATE users SET ? WHERE id = ?', [req.body, userId]);
//         })
//         .then(() => {
//             res.status(200).json({...existingUser, ...req.body });
//         })
//         .catch((err) => {
//             console.error(err);
//             if (err === 'RECORD_NOT_FOUND')
//                 res.status(404).send(`User with id ${userId} not found.`);
//             else res.status(500).send('Error updating a user');
//         });
// });

// router.delete('/:id', (req, res) => {
//     connection.query(
//         'DELETE FROM users WHERE id = ?', [req.params.id],
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send('Error deleting an user');
//             } else {
//                 if (result.affectedRows) res.status(200).send('🎉 User deleted!');
//                 else res.status(404).send('User not found.');
//             }
//         }
//     );
// });

module.exports = router;