const router = require('express').Router();
const usersRouter = require('./users.routes');

router.use('/users', usersRouter);

module.exports = router;