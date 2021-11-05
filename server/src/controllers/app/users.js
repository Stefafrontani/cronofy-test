
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


const { users } = require('../../helpers');
const { getUserProfile } = users;

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

const getEvents = async (req, res) => {
  console.log('getEvents');

  const params = req.params;
  const { userId } = params;

  const userProfile = await getUserProfile(userId);
  const { id: profileId } = userProfile;

  const getUserEventsResponse = await pool.query(`SELECT * FROM users_events e WHERE "profileId" = $1;`, [profileId]);
  const userEvents = getUserEventsResponse.rows;

  const promises = await userEvents.map(async (userEvent, index) => {
    const { eventId } = userEvent;
    const getUserEventsResponse = await pool.query(`SELECT * FROM events e WHERE "id" = $1;`, [eventId]);
    const event = getUserEventsResponse.rows[0];

    return event
  }, []);

  const events = await Promise.all(promises);

  res.send(events);
}

module.exports = {
  getUsers,
  getEvents
}