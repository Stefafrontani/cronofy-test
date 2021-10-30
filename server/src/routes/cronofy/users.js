const { Router } =  require('express');
const router = Router();

const { users } = require('../../controllers/cronofy')
const { getUserInfo } = users;

router.use('*', (req, res, next) => {
  console.log('/users');
  next();
});

router.get('/:userId/info', getUserInfo);

module.exports = router;