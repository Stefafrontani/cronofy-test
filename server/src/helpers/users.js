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

const getUserById = async (userId) => {
  console.log('getUserById')
  try {
    // const response = await pool.query(`INSERT INTO users ("accountId", "accessToken", "refreshToken", sub, "providerName", "profileId", "profileName", "providerService") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *;`, [account_id, access_token, refresh_token, sub, provider_name, profile_id, profile_name, provider_service])
    const response = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId])
    const userFound = (response && response.rows) && response.rows[0];
    return userFound;
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUserById
}