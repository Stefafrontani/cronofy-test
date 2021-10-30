const { Router } =  require('express');
const router = Router();

const auth = require('./auth');
const events = require('./events');
const users = require('./users');

router.use('/auth', auth);
router.use('/events', events);
router.use('/users', users);

module.exports = router;