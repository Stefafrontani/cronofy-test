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

  // const headers = { "Content-Type": "application/json" }
  axios.post('https://api.cronofy.com/oauth/token', bodyToSend, { headers })
  .then((res) => {
    console.log(res)
  })
  .catch(err => console.log(err))
  
  // const response = await pool.query('SELECT * FROM users');
  // try {
  //   const response = await axios.get(/* process.env.CALENDLY_AUTH_BASE_URL */'https://auth.calendly.com', {})
  // } catch (error) {
  //   console.log(error)
  // }
}

module.exports = {
  getAccessToken
}