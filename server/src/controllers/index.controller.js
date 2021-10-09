const { Pool } = require('pg')
const axios = require('axios')

// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' })

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
})

const getAccessToken = async (req, res) => {
  console.log('/getAccessToken');

  const reqBody = req.body;
  const bodyToSend = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    grant_type: "authorization_code",
    code: reqBody.code,
    redirect_uri: process.env.CRONOFY_REDIRECT_URI
  }
  const headers = { "Content-Type": "application/json; charset=utf-8" }

  axios.post('https://api.cronofy.com/oauth/token', bodyToSend, { headers })
  .then(async (response) => {
    const userProfile = response.data;
    console.log(userProfile)
    const signUpResponse = await signUp(userProfile);
    console.log(signUpResponse)
  })
  .catch(err => console.log(err))
}

const signUp = async (userProfile) => {
  console.log('signUp')
  console.log(userProfile)
  
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
    provider_name,
    profile_id,
    profile_name,
    provider_service
  } = linking_profile;

try {
    const response = await pool.query(`INSERT INTO users ("accountId", "accessToken", "refreshToken", sub, "providerName", "profileId", "profileName", "providerService") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *;`, [account_id, access_token, refresh_token, sub, provider_name, profile_id, profile_name, provider_service])
    console.log('response')
    console.log(response)
    return { user: true }
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
  signUp,
  signIn
}