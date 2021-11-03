// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const { events, users } = require('../../helpers');
const { createAppEvent, updateAppEvent } = events;
const { getUserById } = users;

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

  const createNotificationChannelResponse = await cronofyClient.readEvents(queryParams)

  return createNotificationChannelResponse;
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
  };
  res.status(200).send({ ok: true });
}

const createNotificationsChannel = async (req, res) => {
  console.log('/cronofy/events/notifications');

  const reqBody = req.body;
  const { userId: organizerId } = reqBody;

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
    callback_url: `http://b628-152-168-95-55.ngrok.io/cronofy/events/notifications/callback/${organizerId}`
  };

  const createNotificationChannelResponse = await cronofyClient.createNotificationChannel(createNotificationsChannelOptions)
  console.log(createNotificationChannelResponse);

  res.status(200).send('OK');
}

const receiveCronofyNotifications = async (req, res) => {
  console.log('/cronofy/channel/notifications');

  const { notification, channel } = req.body;
  const { type, changes_since } = notification;

  if (type === 'change') {
    console.log('notification.type `CHANGE`');
    const filters = { tzid: 'Etc/UTC', last_modified: changes_since, only_managed: true };
    const response = await getCronofyEvents(req.params.userId, filters);
    const { events } = response;
    
    if (events.length === 1) {
      const eventToUpdate = events[0];
      const updatedEvent = await updateAppEvent(eventToUpdate);
    }
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