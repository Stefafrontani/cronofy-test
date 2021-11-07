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
const { auth } = require('../../helpers');
const { signUp, refreshAccessToken } = auth;

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

const refreshAccessTokenRoute = async (req, res) => {
  console.log('/refreshAccessToken');

  const headers = req.headers;
  const { "user-id": userId} = headers;

  const userUpdated = await refreshAccessToken({ userId });

  res.send(userUpdated);
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
  refreshAccessTokenRoute,
  getElementToken
};