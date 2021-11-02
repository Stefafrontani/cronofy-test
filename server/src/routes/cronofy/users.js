const { Router } =  require('express');
const router = Router();

const { users } = require('../../controllers/cronofy')
const { getUserInfoRoute } = users;

router.use('*', (req, res, next) => {
  console.log('/users');
  next();
});

router.get('/:userId/info', getUserInfoRoute);

module.exports = router;