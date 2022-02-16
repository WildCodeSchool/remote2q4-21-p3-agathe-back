const router = require('express').Router();
const presentationRouter = require('./presentation.routes');
const productsRouter = require('./products.routes');
const usersRouter = require('./users.routes');

router.use('/presentation', presentationRouter);
router.use('/products', productsRouter);
router.use('/users', usersRouter);

module.exports = router;