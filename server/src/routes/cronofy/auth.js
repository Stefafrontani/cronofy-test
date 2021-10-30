const { Router } =  require('express');
const router = Router();

const { auth } = require('../../controllers/cronofy');
const { getAccessToken, refreshAccessToken, getElementToken } = auth;

router.use('*', (req, res, next) => {
  console.log('/auth');
  next();
});

router.post('/token', getAccessToken);
router.post('/token/refresh', refreshAccessToken);
router.post('/elementToken', getElementToken);

module.exports = router;
