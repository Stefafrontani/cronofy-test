// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const { getUserById, getUserInfo, getUserProfile } = require('./users');
const { getCandidateById, createCandidate, createCandidateEvent } = require('./candidates');

const Cronofy = require('cronofy');
const { Pool } = require('pg');
const { refreshAccessToken } = require('./auth');
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
        uri: "http://eadd-152-168-95-55.ngrok.io/cronofy/events/subscriptions/callback",
        transitions: subscriptions
      }
    ];
  };

  const createEventResponse = await cronofyClient.createEvent(requestElementTokenOptions);

  return { status: 200 };
}

const createAppUserEvent = async ({ profileId, eventId }) => {
  let newUserEventCreated;

  const insertUserEventResponse = await pool.query('INSERT INTO users_events ("eventId", "profileId", "status") VALUES ($1, $2, $3) RETURNING *', [eventId, profileId, 'confirmed'])

  newUserEventCreated = insertUserEventResponse.rows[0];
  return newUserEventCreated;
}

const createAppEvent = async (newEvent) => {
  // Destructuring evento
  const { summary, description, start, end, participants, subscriptions, attendees } = newEvent;
  const subscriptionCallbackUrl = "http://eadd-152-168-95-55.ngrok.io/cronofy/events/subscriptions/callback"
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
  const newEventId = insertedEvent.id;

  // Crear candidates if atendees.lenght > 0
  const { invite: attendeesInvitations } = attendees;
  attendeesInvitations.forEach(async (attendee) => {
    const { email } = attendee;
    const getCandidateResponse = await getCandidateById({ email });
    const candidateExists = (getCandidateResponse && getCandidateResponse.rows) && getCandidateResponse.rows.lengh > 0;
    if (!candidateExists) {
      const insertedCandidate = await createCandidate({ email });
      const { id: insertedCandidateId } = insertedCandidate;
      const insertedCandidateEvent = await createCandidateEvent({ candidateId: insertedCandidateId, eventId: newEventId });
    }

  });

  // Insertar evento en cronofy por cada participante
  const cronofyEventData = {
    id: newEventId,
    summary,
    description,
    start,
    end,
    conferencing: {
      profile_id: "default"
    },
    subscriptions,
    attendees
  }

  participants.forEach(async (participant) => {
    const sub = participant.sub;
    const userFound = await getUserById({ sub });
    const { id: userId } = userFound;
    const userUpdated = await refreshAccessToken({ userId })
    const { accessToken } = userUpdated;
    const userInfo = await getUserInfo(accessToken);

    const userProfile = await getUserProfile(userId);
    const { id: profileId } = userProfile;

    const profile = userInfo["cronofy.data"].profiles[0];
    const calendars = profile.profile_calendars;
    const calendar = calendars[0];
    const calendarId = calendar.calendar_id;

    const appUserEventCreationResponse = await createAppUserEvent({ eventId: newEventId, profileId });
    const cronofyEventCreationResponse = await createCronofyEvent({ event: cronofyEventData, calendarId, accessToken });
  });

  // Devolver evento
  return insertedEvent;
}

const checkEventStatus = async (eventAttendees) => {
  const eventStatus = 'unknown';
  if (!eventAttendees.length) {
    return eventStatus;
  }

  for (let i = 0; i < eventAttendees.length; i++) {
    const attendee = attendees[i];
    const { email: attendeeEmail, status: candidateEventStatus } = attendee;

    if (candidateEventStatus) {

    }
    const attendeeStatus = attendee.status;
    const { id: candidateFoundId } = candidateFound;
    console.log(`attendeeStatus, ${attendeeStatus}`);
    if (attendeeStatus === 'needs_action' || attendeeStatus === 'tentative') {
      console.log(`attendeeStatus === 'needs_action'`);
      candidateEventStatus = 'tentative';
    }
    if (attendeeStatus === 'confirmed') {
      console.log(`attendeeStatus === 'confirmed'`);
      candidateEventStatus = 'confirmed';
    }
    if (attendeeStatus === 'declined') {
      console.log(`attendeeStatus === 'declined'`);
      candidateEventStatus = 'declined';
    }
    const updateCandidateEventStatusResponse = await pool.query(`UPDATE candidates_events SET "status" = $1 WHERE "candidateId" = $2 RETURNING *`, [candidateEventStatus, candidateFoundId]);
    const updatedCandidateEvent = updateCandidateEventStatusResponse.rows[0];
    console.log(updatedCandidateEvent);
  }
}

const updateAppEvent = async (newEventData) => {
  console.log('updateAppEvent() helper')
  const { event_id: eventId, start, end, attendees } = newEventData;
  let eventStatus = 'tentative';
  for (let i = 0; i < attendees.length; i++) {
    let candidateEventStatus = '';
    const attendee = attendees[i];
    const { email: attendeeEmail } = attendee;

    const selectCandidateResponse = await pool.query(`SELECT * FROM candidates WHERE email = $1`, [attendeeEmail]);
    const candidateFound = selectCandidateResponse.rows[0];

    if (candidateFound) {
      const attendeeStatus = attendee.status;
      const { id: candidateFoundId } = candidateFound;
      if (attendeeStatus === 'needs_action' || attendeeStatus === 'tentative') {
        candidateEventStatus = 'tentative';
      }
      if (attendeeStatus === 'confirmed') {
        candidateEventStatus = 'confirmed';
      }
      if (attendeeStatus === 'declined') {
        candidateEventStatus = 'declined';
      }
      const updateCandidateEventStatusResponse = await pool.query(`UPDATE candidates_events SET "status" = $1 WHERE "candidateId" = $2 RETURNING *`, [candidateEventStatus, candidateFoundId]);
      const updatedCandidateEvent = updateCandidateEventStatusResponse.rows[0];
    }
  }
  
  
  const updateAppEventResponse = await pool.query(`UPDATE events SET "start" = $1, "end" = $2 WHERE id=$3 RETURNING *`, [start, end, eventId]);

  const updatedEvent = [updateAppEventResponse && updateAppEventResponse.rows] && updateAppEventResponse.rows[0];

  return updatedEvent;
}

module.exports = {
  createAppEvent,
  createCronofyEvent,
  updateAppEvent
}