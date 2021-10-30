// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const { Pool } = require('pg');
const Cronofy = require('cronofy');
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
})

const createEvent = async (req, res) => {
  const reqBody = req.body;
  const slot = reqBody.slot || {};
  const { start, end, participants, attendees, subscriptions } = slot;
  
  participants.forEach(async (user) => {
    const { sub } = user;
    const selectUserByIdResponse = await pool.query(`SELECT * FROM users WHERE sub=$1;`, [sub]);
    const userFound = selectUserByIdResponse.rows && selectUserByIdResponse.rows[0];

    const { accessToken } = userFound;
    
    const cronofyClientOptions = {
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      data_center: process.env.CRONOFY_DATA_CENTER_ID,
      access_token: accessToken
    };

    const cronofyClient = new Cronofy(cronofyClientOptions);

    const userInfo = await cronofyClient.userInfo();
    const calendars = userInfo["cronofy.data"].profiles[0].profile_calendars
    

    calendars.forEach(async (calendar) => {
      const { calendar_id } = calendar;
      const requestElementTokenOptions = {
        calendar_id: calendar_id,
        event_id: `lala2`,
        summary: "Demo meeting",
        description: "The Cronofy developer demo has created this event",
        start: start,
        end: end,
        conferencing: {
          profile_id: "default"
        },
        subscriptions
      }

      if(attendees) {
        requestElementTokenOptions.attendees = attendees;
      }
  
      const createEventResponse = await cronofyClient.createEvent(requestElementTokenOptions)
      console.log(createEventResponse)
    })
  });

  return;
}

module.exports = {
  createEvent
}