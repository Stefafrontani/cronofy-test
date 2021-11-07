// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const Cronofy = require('cronofy');
const { getUserById } = require('./users');

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
});

const signUp = async (cronofyUser) => {
  console.log('signUp')
  let res;

  const {
    account_id, 
    access_token,
    refresh_token,
    sub,
    linking_profile,
    // expires_in,
    // token_type,
    // scope,
  } = cronofyUser;

   const {
    provider_name,
    profile_id,
    profile_name,
    provider_service
  } = linking_profile;

  // Busco user por accountId
  const userResponse = await pool.query('SELECT * from users WHERE "accountId"=$1', [account_id]);
  const userFound = userResponse.rows && userResponse.rows[0]

  if (userFound) {
    res = { ...res, user: userFound }
    // SI encuentro: 
    // Busco su profileId
    const userId = userFound.id;
    const profileResponse = await pool.query('SELECT * from profiles WHERE "userId" = $1 AND "profileId" = $2;', [userId, profile_id]);
    const profileFound = profileResponse.rows && profileResponse.rows[0];

    if (profileFound) {
      // SI match
      // No hago nada
      res = { ...res, profile: profileFound}
    } else {
      // NO match
      // Inserto nuevo profile
      const insertProfileResponse = await pool.query('INSERT INTO profiles ("userId", "providerName", "profileId", "profileName", "providerService") VALUES ($1, $2, $3, $4, $5) RETURNING *', [userId, provider_name, profile_id, profile_name, provider_service])
      const profileInserted = insertProfileResponse.rows && insertProfileResponse.rows[0];
      res = { ...res, profile: profileInserted } 
    }
  } else {
  // NO encuentro
    // INSERT usuario en USERS
    const insertUserResponse = await pool.query('INSERT INTO users (sub, "accessToken", "refreshToken", "accountId") VALUES ($1, $2, $3, $4) RETURNING *', [sub, access_token, refresh_token, account_id])
    const userInserted = insertUserResponse.rows && insertUserResponse.rows[0];
    const insertedUserId = userInserted.id;
    // INSERT profile en PROFILES
    const insertProfileResponse = await pool.query('INSERT INTO profiles ("userId", "providerName", "profileId", "profileName", "providerService") VALUES ($1, $2, $3, $4, $5) RETURNING *', [insertedUserId, provider_name, profile_id, profile_name, provider_service])
    const profileInserted = insertProfileResponse.rows && insertProfileResponse.rows[0]
  
    res = { ...res, user: userInserted, profile: profileInserted }
  }

  return res
}

const refreshAccessToken = async ({ userId, accessToken }) => {
  if (userId) {
    const user = await getUserById({ userId });
    
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

    return userUpdated;
  }  
}

module.exports = {
  signUp,
  refreshAccessToken,
}