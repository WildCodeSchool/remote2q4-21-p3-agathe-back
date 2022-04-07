const router = require("express").Router();
const Joi = require('joi');
const { checkJwt, isAdmin } = require('../middlewares/checkJwt')
const Orders = require('../models/orders');
const OrdersStatus = require('../models/ordersStatus');
const OrdersLines = require('../models/ordersLines')

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

router.get('/pending_deliveries', (req, res) =>
    Orders.pendingDeliveries()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en recherchant les commandes en attente de livraison')
    })
)

router.get('/pending_payment', (req, res) =>
    Orders.pendingPayment()
    .then(orders => res.json(orders))
    .catch(err => {
        console.log(err)
        res.status(500).send('Erreur en recherchant les commandes en attente de paiement')
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

// router.get('/:id', checkJwt, isAdmin, (req, res) =>
router.get('/:id', async(req, res) => {
    try {
        let order = await Orders.findOne(req.params.id)
        if (order) return res.json(order)
        else return res.status(404).send('Order not found')
    } catch (err) {
        console.log(err)
        return res.status(500).send('Error retrieving order from database');
    }
});

router.post('/', checkJwt, (req, res) => {
    // recup donnees requete
    // const { value, error } = userSchema.validate(req.body);
    // if (error) {
    //     console.log(error)
    //     return res.status(400).json(error);
    // }
    const user_id = req.user.id
    const total_amount = req.body.reduce(
        (total, cartItem) => total + cartItem.quantity * cartItem.price,
        0
    );

    // vérifier total amount

    Orders.create({ user_id, total_amount, status_id: 1 })
        .then(order => {
            // add status
            let order_id = order.id
            let state_id = 1
            let status_date = new Date()
            OrdersStatus.create({ order_id, state_id, status_date })

            // add lines
            for (let line of req.body)
                OrdersLines.create({ order_id, id: line.id, quantity: line.quantity, price: line.price })

            res.json(order)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send('Erreur en recherchant le montant des commandes de la semaine dernière')
        })
})

router.put('/paid/:id', async(req, res) => {
    try {
        let order = await Orders.findOne(req.params.id)
        if (order && order.status_id === 1) {
            OrdersStatus.create({ order_id: req.params.id, state_id: 2, status_date: new Date() })
            let order = Orders.update(req.params.id, { status_id: 2 })
            return res.json({...order, status_id: 2 })
        } else return res.status(403).send('Order can not be paid')
    } catch (err) {
        console.log(err)
        return res.status(500).send('Error changing order status');
    }
});

router.put('/shipped/:id', async(req, res) => {
    try {
        let order = await Orders.findOne(req.params.id)
        if (order && order.status_id === 2) {
            OrdersStatus.create({ order_id: req.params.id, state_id: 3, status_date: new Date() })
            let order = Orders.update(req.params.id, { status_id: 3 })
            return res.json({...order, status_id: 3 })
        } else return res.status(403).send('Order can not be paid')
    } catch (err) {
        console.log(err)
        return res.status(500).send('Error changing order status');
    }
});

module.exports = router;