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
})
const { auth, users } = require('../../helpers');
const { signUp } = auth;
const { getUserById } = users;

const getAccessToken = async (req, res) => {
  console.log('/getAccessToken');

  const reqBody = req.body;
  const authorizationCode = reqBody.code;
  if (authorizationCode) {
    const cronofyClient = new Cronofy({
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      data_center: process.env.CRONOFY_DATA_CENTER_ID
    });

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
    res.send(cronofyUser)
  }
}

const getAccessTokenNCC = async (req, res) => {
  console.log('/getAccessTokenNCC');

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
  
  axios.post(`${process.env.CRONOFY_DATA_CENTER_ID}/cronofy/auth/token`, bodyToSend, { headers })
  .then(async (response) => {
    const userProfile = response.data;
    console.log(userProfile)
    const signUpResponse = await signUp(userProfile);
    console.log(signUpResponse)
  })
  .catch(err => console.log(err))
}

const refreshAccessToken = async (req, res) => {
  console.log('/refreshAccessToken');

  const reqBody = req.body;
  const userId = reqBody.userId;
  if (userId) {
    const user = await getUserById(userId);
    
    const cronofyClient = new Cronofy({
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      data_center: process.env.CRONOFY_DATA_CENTER_ID
    });
    
    const cronofyUserInfo = await cronofyClient.refreshAccessToken({
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: user.refreshToken
    }).catch((err) => {
      console.error(err);
    });

    const { access_token } = cronofyUserInfo;
    const response = await pool.query(`UPDATE users SET "accessToken" = $1 WHERE id = $2 RETURNING *;`, [access_token, userId])
    
    const userUpdated = response && response.rows && response.rows[0];

    res.send(userUpdated)
  }
}

const getElementToken = async (req, res) => {
  const { subs, permissions } = req.body;

  const cronofyClient = new Cronofy({
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID
  });

  try {
    const requestElementTokenOptions = {
      version: "1",
      permissions: permissions,
      subs: subs,
      origin: process.env.COLONY_ORIGIN
    }
    const requestElementTokenResponse = await cronofyClient.requestElementToken(requestElementTokenOptions)
    const elementToken = requestElementTokenResponse.element_token
    res.send(elementToken);
  } catch (error) {
    console.log('error', error)
  }
}

module.exports = {
  getAccessToken,
  getAccessTokenNCC,
  refreshAccessToken,
  getElementToken
};