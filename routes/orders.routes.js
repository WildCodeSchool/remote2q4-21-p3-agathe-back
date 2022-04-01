const router = require("express").Router();
const Joi = require('joi');
const { checkJwt, isAdmin } = require('../middlewares/checkJwt')
const Orders = require('../models/orders');
const OrdersStatus = require('../models/ordersStatus');
const OrdersLine = require('../models/ordersLine')

router.get('/', checkJwt, isAdmin, (req, res) =>
    Orders.findMany()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Error retrieving orders from database');
    })
);

router.get('/count', (req, res) =>
    Orders.count()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en recherchant le montant des commandes dans la base de données')
    })
)

router.get('/total', (req, res) =>
    Orders.total()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en recherchant le montant des ventes dans la base de données')
    })
)

router.get('/pending_deliveries', (req, res) =>
    Orders.pendingDeliveries()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en recherchant les commandes en attente de livraison')
    })
)

// Stats
router.get('/daily_sales', (req, res) =>
    Orders.dailySales()
    .then(sales => res.json(sales))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en recherchant le montant des commandes du jour')
    })
)

router.get('/last_month_sales', (req, res) =>
    Orders.lastMonthSales()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en recherchant le montant des commandes du mois dernier')
    })
);

router.get('/last_week_sales', (req, res) =>
    Orders.lastWeekSales()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en recherchant le montant des commandes de la semaine dernière')
    })
);

router.get('/yesterday_sales', (req, res) =>
    Orders.yesterdaySales()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send("Erreur en recherchant le montant des commandes de la journée d'hier")
    })
);

router.get('/yearly_sales', (req, res) =>
    Orders.yearlySales()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send("Erreur en recherchant le montant des commandes sur l'année")
    })
);

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

router.post('/', checkJwt, (req, res) => {
    // recup donnees requete
    // const { value, error } = userSchema.validate(req.body);
    // if (error) {
    //     console.log(error)
    //     return res.status(400).json(error);
    // }
    const UserID = req.user.id
    const TotalAmount = req.body.reduce(
        (total, cartItem) => total + cartItem.quantity * cartItem.price,
        0
    );

    // vérifier total amount

    Orders.create({ UserID, TotalAmount, status_id: 1 })
        .then(order => {
            // add status
            let OrderID = order.OrderID
            let StateID = 1
            let StatusDate = new Date()
            OrdersStatus.create({ OrderID, StateID, StatusDate })

            // add lines
            for (let line of req.body)
                OrdersLine.create({ OrderID, ProductID: line.ProductID, Quantity: line.quantity, Price: line.price })

            res.json(order)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send('Erreur en recherchant le montant des commandes de la semaine dernière')
        })
})

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