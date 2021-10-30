const { Router } =  require('express');
const router = Router();

const { users } = require('../../controllers/app')
const { getUsers/* , getUserById */ } = users;

router.use('*', (req, res, next) => {
  console.log('/users');
  next();
});

router.get('/', getUsers);
// router.get('/:userId', getUserById);

module.exports = router;