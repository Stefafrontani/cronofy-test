// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const { users } = require('../../helpers');
const { getUserById, getUserInfo } = users;

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
  const userFound = await getUserById({ userId });

  const cronofyClientOptions = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID,
    access_token: userFound.accessToken
  };

  const cronofyClient = new Cronofy(cronofyClientOptions);

  const queryString = Object.entries(queryParams).reduce((acc, [key, value]) => { return `${acc}&${key}=${value}` }, '');
  console.log(queryString);

  const createNotificationChannelResponse = await cronofyClient.readEvents(queryString)

  console.log(createNotificationChannelResponse);

  res.status(200).send('OK')
}

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

const createEventRoute = async (req, res) => {
  const reqBody = req.body;
  const newEvent = reqBody.newEvent || {};
  const newAppEvent = await createAppEvent(newEvent);
  // const newCronofyEvent = await createCronofyEvent(slot);

  res.send(newAppEvent);
}

const receiveCronofyEventsTriggers = async (req, res) => {
  console.log('/subscriptions/callback');

  const reqBody = req.body;
  const transitions = reqBody.notification.transitions;
  transitions.forEach((transition) => {
    console.log(transition)
  });
  const receivedTransition = transitions[0];
  const receivedTransitionType = receivedTransition.type;
  const eventId = reqBody.event.event_id;
  const expectedTransitionType = 'event_end';
  if (receivedTransitionType === expectedTransitionType) {
    const insertEventResponse = await pool.query(
      `UPDATE events SET "status" = 'completed' WHERE id = $1;`,
    [eventId]);
  }
  res.status(200).send({ ok: true });
}

const createNotificationsChannel = async (req, res) => {
  console.log('/cronofy/notifications');

  const reqBody = req.body;
  const { userId: organizerId } = req.body;

  const userFound = await getUserById({ userId: organizerId });

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
  createEventRoute,
  receiveCronofyEventsTriggers,
  createNotificationsChannel,
  receiveCronofyNotifications,
}