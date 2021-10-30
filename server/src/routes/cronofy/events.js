const { Router } =  require('express');
const router = Router();
const { events } = require('../../controllers/cronofy');
const {
  getCronofyEvents,
  createEvent,
  receiveCronofyEventsTriggers,
  createNotificationsChannel,
  receiveCronofyNotifications,
} = events;

router.use('*', (req, res, next) => {
  console.log('/events');
  next();
});

router.get('/', getCronofyEvents);
router.post('/', createEvent);
router.get('/subscriptions/callback', receiveCronofyEventsTriggers);
router.post('/notifications', createNotificationsChannel);
router.post('/notifications/callback', receiveCronofyNotifications);

module.exports = router;