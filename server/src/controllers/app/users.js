
// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const { Pool } = require('pg')
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
});

const querysFunctions = require('../../helpers/querys')
const { returnArrayOfJson } = querysFunctions;

const getUsers = async (req, res) => {
  console.log('getUsers');

  const response = await pool.query(
    `SELECT
      id,
      u."accessToken",
      u."sub",
      u."accountId",
      (
        ${returnArrayOfJson(
          `
            SELECT *
            FROM profiles p
            WHERE u.id = p."userId"
          `
        )}
      ) AS profiles
    FROM users u;`
  );

  const usersWithProfiles = response.rows;
  // try {
  //   // const response = await pool.query(`SELECT * FROM users;`)
  //   const response = await pool.query(`SELECT * FROM profiles p INNER JOIN users u ON p."userId" = u.id;`);
  //   console.log(response)
  //   const usersFound = response.rows;
  //   res.send(usersFound);
  // } catch (error) {
  //   console.log(error)
  // }
  res.send(usersWithProfiles);
}

module.exports = {
  getUsers
}