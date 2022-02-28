const router = require('express').Router();
const authRouter = require('./auth.routes');
const presentationRouter = require('./presentation.routes');
const productsRouter = require('./products.routes');
const usersRouter = require('./users.routes');

router.use('/auth', authRouter);
router.use('/presentation', presentationRouter);
router.use('/products', productsRouter);
router.use('/users', usersRouter);

module.exports = router;