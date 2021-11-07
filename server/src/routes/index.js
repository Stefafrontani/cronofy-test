// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const Cronofy = require('cronofy');
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
});

const axios = require('axios');
const { Router } =  require('express')
const router = Router()
const app = require('./app');
const cronofy = require('./cronofy');
const { refreshAccessToken } = require('../helpers/auth');

router.use(async (req, res, next) => {
  const { "user-id": userId } = req.headers;
  console.log("Header `user-id` defined: ", userId);

  if (!userId) {
    console.log("Header `user-id` undefined");
  } else {
    const userUpdated = await refreshAccessToken({ userId });
    req.user = userUpdated;
  }

  next();
});

router.use('/app', app);
router.use('/cronofy', cronofy);

module.exports = router;