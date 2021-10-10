const { Router } =  require('express')
const router = Router()
const { getAccessToken, getElementToken } = require('../controllers/index.controller')

router.post('/oauth/token', getAccessToken);
router.post('/elementToken', getElementToken);

module.exports = router;