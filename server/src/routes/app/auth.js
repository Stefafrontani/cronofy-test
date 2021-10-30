const { Router } =  require('express')
const router = Router()

router.use('*', () => {
  console.log('/auth');
  next();
});

module.exports = router;