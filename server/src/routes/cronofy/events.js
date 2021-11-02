const { Router } =  require('express');
const router = Router();
const { events } = require('../../controllers/cronofy');
const {
  getCronofyEvents,
  createEventRoute,
  receiveCronofyEventsTriggers,
  createNotificationsChannel,
  receiveCronofyNotifications,
} = events;

router.use('*', (req, res, next) => {
  console.log('/events');
  next();
});

router.get('/', getCronofyEvents);
router.post('/', createEventRoute);
router.post('/subscriptions/callback', receiveCronofyEventsTriggers);
router.post('/notifications', createNotificationsChannel);
router.post('/notifications/callback', receiveCronofyNotifications);

module.exports = router;