const { Router } =  require('express');
const router = Router();

const { auth } = require('../../controllers/cronofy');
const { getAccessToken, refreshAccessTokenRoute, getElementToken } = auth;

router.use('*', (req, res, next) => {
  console.log('/auth');
  next();
});

router.post('/token', getAccessToken);
router.post('/token/refresh', refreshAccessTokenRoute);
router.post('/elementToken', getElementToken);

module.exports = router;
