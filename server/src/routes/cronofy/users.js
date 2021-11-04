const { Router } =  require('express');
const router = Router();

const { users } = require('../../controllers/cronofy');
const { getUserInfoRoute, getUserNotificationsChannelsRoute, deleteNotificationsChannelRoute } = users;

router.use('*', (req, res, next) => {
  console.log('/users');
  next();
});

router.get('/:userId/info', getUserInfoRoute);
router.get('/:userId/notifications', getUserNotificationsChannelsRoute);
router.delete('/:userId/notifications/:channelId', deleteNotificationsChannelRoute);

module.exports = router;