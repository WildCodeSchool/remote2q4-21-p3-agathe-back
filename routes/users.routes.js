const router = require("express").Router();
const Joi = require('joi');
const argon2 = require('argon2');
const {
    generateJWT
} = require('../utils/auth');
const { checkJwt, isAdmin } = require('../middlewares/checkJwt');
const Orders = require('../models/orders');
const Users = require('../models/users');

// router.get('/', checkJwt, (req, res) =>
router.get('/', (req, res) =>
    Users.findMany()
    .then(users => res.json(users))
    .catch(err => {
        console.log(err)
        res.status(500).send('Error retrieving users from database');
    })
);

router.get('/count', (req, res) =>
    Users.count()
    .then(users => res.json(users))
    .catch(err => {
        console.log(err)
        res.status(500).send('Error retrieving users from database');
    })
);

router.get('/:id', checkJwt, (req, res) => {
    if (!req.user.is_admin && req.user.id !== req.params.id)
        return res.status(403).send('User not authorized');
    return Users.findOne(req.params.id)
        .then(user => {
            if (user) res.json(user);
            else res.status(404).send('User not found');
        })
        .catch(err => {
            res.status(500).send('Error retrieving user from database');
        })
});

router.get('/:id/orders', checkJwt, (req, res) => {
    let UserId;
    if (req.params.id === '0') UserId = req.user.id
    else UserId = req.params.id
    return Orders.findForUser(UserId)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).send('Error retrieving orders for user from database'))
});

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone_number: Joi.string().required(),
    address_1: Joi.string().required(),
    address_2: Joi.string().allow(null, ''),
    address_3: Joi.string().allow(null, ''),
    post_code: Joi.string().required(),
    city: Joi.string().required()
})

router.post('/', async(req, res) => {
    const {
        value,
        error
    } = userSchema.validate(req.body);
    if (error) {
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

    const hashedPassword = await argon2.hash(value.password);

    let user = await Users.insertUser(value.email, hashedPassword, value.first_name, value.last_name,
        value.phone_number, value.address_1, value.address_2, value.address_3,
        value.post_code, value.city);

    value.id = user[0].insertId
    value.is_admin = false
    const token = generateJWT(value.email, value.is_admin);
    let date = new Date();
    let oneHour = 60 * 60; // expires in 1 hour
    res.cookie("user_token", token, { maxAge: oneHour * 1000, httpOnly: true }); //, secure: true }); HTTPS ONLY
    let { password, ...userData } = value // remove the password
    return res.json(userData)
})


router.put('/', checkJwt, async(req, res) => {
    const userId = req.user.id;
    try {
        let existingUser = await Users.findOne(userId);
        if (!existingUser) throw new Error('RECORD_NOT_FOUND');
        // etape de l'encryptage
        // const hashedPassword = await argon2.hash(req.body.password);
        await Users.updateUser({
            ...req.body,
            id: userId,
            // password: hashedPassword
        });
        res.status(200).json({
            ...existingUser,
            ...req.body
        });
    } catch (err) {
        console.error(err);
        if (err === 'RECORD_NOT_FOUND')
            res.status(404).send(`User with id ${userId} not found.`);
        else res.status(500).send('Error updating a user');
    }
});

router.put('/:id', checkJwt, isAdmin, async(req, res) => {
    const userId = req.params.id;
    console.log(`userId: ${userId}`)
    console.log(req.body)
    console.log(req.user)
    try {
        let existingUser = await Users.findOne(userId);
        if (!existingUser) throw new Error('RECORD_NOT_FOUND');
        // etape de l'encryptage
        const hashedPassword = await argon2.hash(req.body.password);
        await Users.updateUser({
            ...req.body,
            id: userId,
            password: hashedPassword
        });
        res.status(200).json({
            ...existingUser,
            ...req.body
        });
    } catch (error) {
        console.error(err);
        if (err === 'RECORD_NOT_FOUND')
            res.status(404).send(`User with id ${userId} not found.`);
        else res.status(500).send('Error updating a user');
    }
});

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