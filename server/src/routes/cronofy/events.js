const { Router } =  require('express');
const router = Router();
const { events } = require('../../controllers/cronofy');
const {
  createEvent,
} = events;

router.use('*', (req, res, next) => {
  console.log('/events');
  next();
});

router.post('/', createEvent);

module.exports = router;