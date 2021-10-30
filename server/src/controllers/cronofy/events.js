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


const getCronofyEvents = async (userId, queryParams) => {
  console.log('/cronofy/events');
  const userFound = await getUserById(userId);

  console.log(userFound);

  const cronofyClientOptions = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID,
    access_token: userFound.accessToken
  };

  const cronofyClient = new Cronofy(cronofyClientOptions);

  const queryString = Object.entries(queryParams).reduce((acc, [key, value]) => { return `${acc}&${key}=${value}`}, '');
  console.log(queryString);
  
  const createNotificationChannelResponse = await cronofyClient.readEvents(queryString)

  console.log(createNotificationChannelResponse);

  res.status(200).send('OK')
}

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

const receiveCronofyEventsTriggers = (req, res) => {
  console.log('/cronofy/events/triggers');

  console.log("req.body");
  console.log(req.body);

  console.log("req.params");
  console.log(req.params);

  console.log("req.query");
  console.log(req.query);

  res.status(200).send('OK');
}

const createNotificationsChannel = async (req, res) => {
  console.log('/cronofy/notifications');

  const reqBody = req.body;
  const { userId: organizerId } = req.body;
  
  const userFound = await getUserById(organizerId);

  console.log(userFound);

  const cronofyClientOptions = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID,
    access_token: userFound.accessToken
  };

  const cronofyClient = new Cronofy(cronofyClientOptions);

  // const userInfo = await cronofyClient.userInfo();
  // const calendars = userInfo["cronofy.data"].profiles[0].profile_calendars

  const createNotificationsChannelOptions = {
    callback_url: "http://b628-152-168-95-55.ngrok.io/cronofy/channel/notifications"
  };

  const createNotificationChannelResponse = await cronofyClient.createNotificationChannel(createNotificationsChannelOptions)
  console.log(createNotificationChannelResponse);

  res.status(200).send('OK');
}

const receiveCronofyNotifications = (req, res) => {
  console.log('/cronofy/channel/notifications');

  // ReadEvents
  console.log("req.body");
  console.log(req.body);

  const { notification, channel } = req.body;
  const { type, change_since } = notification;

  if (type === 'change') {
    console.log('notification.type `CHANGE`');
    const queryParams = { last_modified: change_since }
    getCronofyEvents(queryParams);
  }

  res.status(200).send('OK');
}

module.exports = {
  getCronofyEvents,
  createEvent,
  receiveCronofyEventsTriggers,
  createNotificationsChannel,
  receiveCronofyNotifications,
}