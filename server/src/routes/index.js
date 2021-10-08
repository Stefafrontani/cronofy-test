const { Router } =  require('express')
const router = Router()
const { getAccessToken } = require('../controllers/index.controller')

router.post('/oauth/token', getAccessToken);

module.exports = router;