const { Pool } = require('pg')
const axios = require('axios')
const Cronofy = require('cronofy')

const cronofyClient = new Cronofy({
  client_id: process.env.CRONOFY_CLIENT_ID,
  client_secret: process.env.CRONOFY_CLIENT_SECRET,
  data_center: process.env.CRONOFY_DATA_CENTER_URL
});

// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' })

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
})

/** CRONOFY */
/** with cronofy client */
const getAccessToken = async (req, res) => {
  console.log('/getAccessToken');

  const reqBody = req.body;
  const authorizationCode = reqBody.code;
  if (authorizationCode) {
    const userInfo = await cronofyClient.requestAccessToken({
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: process.env.CRONOFY_REDIRECT_URI
    }).catch((err) => {
      console.error(err);
    });

    const cronofyUser = await signUp(userInfo);
    console.log('cronofyUser devolver al front')
    res.send(cronofyUser)
  }
}

const getElementToken = async (req, res) => {
  const { cronofyUserSub } = req.body;
  console.log('cronofyUserSub');
  console.log(cronofyUserSub);
  console.log(`${process.env.COLONY_ORIGIN_REQUESTS}/calendarSync`);
  console.log(`${process.env.CRONOFY_REDIRECT_URI}`);

  const elementToken = await cronofyClient.requestElementToken({
    version: "1",
    permissions: ["account_management"],
    subs: [cronofyUserSub],
    origin: `${process.env.CRONOFY_REDIRECT_URI}`
  }).catch((err) => {
    console.error(err);
  })

  console.log('elementToken')
  console.log(elementToken)

  res.send(elementToken)
}

/** NO cronofy client */
const getAccessTokenNCC = async (req, res) => {
  console.log('/getAccessToken');

  const reqBody = req.body;
  const authorizationCode = reqBody.code;

  const bodyToSend = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    grant_type: "authorization_code",
    code: authorizationCode,
    redirect_uri: process.env.CRONOFY_REDIRECT_URI
  }
  const headers = { "Content-Type": "application/json; charset=utf-8" }
  
  axios.post(`${process.env.CRONOFY_DATA_CENTER_URL}/oauth/token`, bodyToSend, { headers })
  .then(async (response) => {
    const userProfile = response.data;
    console.log(userProfile)
    const signUpResponse = await signUp(userProfile);
    console.log(signUpResponse)
  })
  .catch(err => console.log(err))
}


const signUp = async (cronofyUser) => {
  console.log('signUp')
  
  const {
    account_id, 
    access_token,
    refresh_token,
    sub,
    linking_profile,
    expires_in,
    token_type,
    scope,
  } = cronofyUser;

   const {
    provider_name,
    profile_id,
    profile_name,
    provider_service
  } = linking_profile;

  try {
    console.log('try isnerting into database')
    const response = await pool.query(`INSERT INTO users ("accountId", "accessToken", "refreshToken", sub, "providerName", "profileId", "profileName", "providerService") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *;`, [account_id, access_token, refresh_token, sub, provider_name, profile_id, profile_name, provider_service])
    console.log('cronofyUser dsp del signup')
    console.log(cronofyUser)
    return cronofyUser
  } catch (error) {
    console.log(error)
  }
}

const signIn = async  (userProfile) => {
  console.log('signIn')
  const {
    account_id, 
    access_token,
    refresh_token,
    sub,
    linking_profile,
    expires_in,
    token_type,
    scope,
  } = userProfile;

   const {
    profile_id,
    profile_name,
    provider_service
  } = linking_profile;

  try {
    const response = await pool.query(`SELECT * FROM users WHERE "accountId"=${account_id};`)
    console.log('response')
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAccessToken,
  getElementToken,
  getAccessTokenNCC,
  signUp,
  signIn
}

// NCC = No Cronocy Client