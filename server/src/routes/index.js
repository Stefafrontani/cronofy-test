const { Router } =  require('express')
const router = Router()
const app = require('./app');
const cronofy = require('./cronofy');

router.use('/app', app);
router.use('/cronofy', cronofy);

module.exports = router;