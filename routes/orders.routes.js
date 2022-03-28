const router = require("express").Router();
const Joi = require('joi');
const checkJwt = require('../middlewares/checkJwt')
const Orders = require('../models/orders');

// router.get('/', checkJwt, (req, res) =>
router.get('/', (req, res) =>
    Orders.findMany()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Error retrieving orders from database');
    })
);

router.get('/total', (req, res) =>
    Orders.total()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en cherchant le total des ventes dans la base de données')
    })
)

router.get('/total_orders', (req, res) =>
    Orders.totalOrders()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en cherchant le total des commandes dans la base de données')
    })
)


// router.get('/:id', (req, res) =>
//     Users.findOne(req.params.id)
//     .then(user => {
//         if (user.length) res.json(results[0]);
//         else res.status(404).send('User not found');
//     })
//     .catch(err => {
//         res.status(500).send('Error retrieving user from database');
//     })
// );

// const userSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
//     FirstName: Joi.string().required(),
//     LastName: Joi.string().required(),
//     PhoneNumber: Joi.string().required(),
//     Address1: Joi.string().required(),
//     Address2: Joi.string().allow(null, ''),
//     Address3: Joi.string().allow(null, ''),
//     postCode: Joi.string().required(),
//     city: Joi.string().required()
// })

// router.post('/', async(req, res) => {
//     // recup donnees requete
//     const { value, error } = userSchema.validate(req.body);
//     if (error) {
//         console.log(error)
//         return res.status(400).json(error);
//     }

//     // verifie si user existe
//     // await permet d'etre sur d'avoir un retour de verif user
//     const [
//         [existingUser]
//     ] = await Users.findUserByEmail(value.email);
//     if (existingUser) {
//         return res.status(409).json({
//             message: "l'utilisateur existe deja",
//         })
//     }

//     // etape de l'encryptage
//     const hashedPassword = await argon2.hash(value.password);

//     await Users.insertUser(value.email, hashedPassword, value.FirstName, value.LastName,
//         value.PhoneNumber, value.Address1, value.Address2, value.Address3,
//         value.postCode, value.city);

//     const jwtKey = generateJWT(value.email, 'ROLE_USER');
//     return res.json({ credentials: jwtKey })
// })

// router.put('/:id', async(req, res) => {
//     const userId = req.params.id;
//     try {
//         let existingUser = await Users.findOne(userId);
//         if (!existingUser) throw new Error('RECORD_NOT_FOUND');
//         // etape de l'encryptage
//         const hashedPassword = await argon2.hash(req.body.password);
//         await Users.updateUser({...req.body, id: userId, password: hashedPassword });
//         res.status(200).json({...existingUser, ...req.body });
//     } catch (error) {
//         console.error(err);
//         if (err === 'RECORD_NOT_FOUND')
//             res.status(404).send(`User with id ${userId} not found.`);
//         else res.status(500).send('Error updating a user');
//     }
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