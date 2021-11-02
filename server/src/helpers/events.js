// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const { getUserById, getUserInfo } = require('./users');

const Cronofy = require('cronofy');
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
});

const createCronofyEvent = async ({ event, calendarId, accessToken }) => {
  const { id: eventId, summary, description, start, end, conferencing, attendees, subscriptions } = event;

  const cronofyClientOptions = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID,
    access_token: accessToken
  };

  const cronofyClient = new Cronofy(cronofyClientOptions);

  const requestElementTokenOptions = {
    calendar_id: calendarId,
    event_id: eventId,
    summary,
    description,
    start,
    end,
    conferencing
  }

  if (attendees) {
    requestElementTokenOptions.attendees = attendees;
  };
  if (subscriptions.length) {
    requestElementTokenOptions.subscriptions = [
      {
        type: "webhook",
        uri: "http://b628-152-168-95-55.ngrok.io/cronofy/events/subscriptions/callback",
        transitions: subscriptions
      }
    ];
  };

  const createEventResponse = await cronofyClient.createEvent(requestElementTokenOptions);

  return { status: 200 };
}

const createAppEvent = async (newEvent) => {
  // Destructuring evento
  const { summary, description, start, end, participants, subscriptions } = newEvent;
  const subscriptionCallbackUrl = "http://b628-152-168-95-55.ngrok.io/cronofy/events/subscriptions/callback"
  const defaultEventStatus = 'tentative';

  if (subscriptions.length) {
    newEvent.subscriptions = [
      {
        type: "webhook",
        uri: subscriptionCallbackUrl,
        transitions: subscriptions
      }
    ];
  }

  // Insert Evento en bd
  const insertEventResponse = await pool.query('INSERT INTO events ("subscriptionCallbackUrl", summary, description, start, "end", status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
    [subscriptionCallbackUrl, summary, description, start, end, defaultEventStatus]
  );
  const insertedEvent = insertEventResponse.rows[0];

  // Insertar evento en cronofy por cada participante
  const cronofyEventData = {
    id: insertedEvent.id,
    summary,
    description,
    start,
    end,
    conferencing: {
      profile_id: "default"
    },
    subscriptions
  }

  participants.forEach(async (participant) => {
    const sub = participant.sub;
    const userFound = await getUserById({ sub });
    const { accessToken } = userFound;
    const userInfo = await getUserInfo(accessToken);

    const profile = userInfo["cronofy.data"].profiles[0];
    const calendars = profile.profile_calendars;
    const profileId = profile.profile_id;
    const calendar = calendars[0];
    const calendarId = calendar.calendar_id;

    const cronofyEventCreationResponse = await createCronofyEvent({ event: cronofyEventData, calendarId, accessToken });
    console.log(cronofyEventCreationResponse);
  });

  // Devolver evento
  return insertedEvent;
}

module.exports = {
  createAppEvent,
  createCronofyEvent
}