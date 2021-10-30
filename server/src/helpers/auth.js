// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

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

module.exports = {
  signUp
}