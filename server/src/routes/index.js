const { Router } =  require('express')
const router = Router()
const {
  getAccessToken,
  refreshAccessToken,
  getElementToken,
  createEvent,
  getUsers,
  getUserById,
  getUserInfo
} = require('../controllers/index.controller')

router.post('/oauth/token', getAccessToken);
router.post('/oauth/token/refresh', refreshAccessToken);
router.post('/elementToken', getElementToken);
router.post('/events', createEvent);
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.get('/users/:userId/info', getUserInfo);

module.exports = router;