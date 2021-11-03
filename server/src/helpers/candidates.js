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

const getCandidateById = async ({ userId, email }) => {
  console.log('getCandidateById');
  let candidateFound = null;
  if (userId) {
    try {
      const response = await pool.query(`SELECT * FROM candidates WHERE id=$1`, [userId])
      candidateFound = (response && response.rows) && response.rows[0];
    } catch (error) {
      console.log(error)
    }
  }
  if (email && !candidateFound) {
    try {
      const response = await pool.query(`SELECT * FROM candidates WHERE "email"=$1`, [email])
      candidateFound = (response && response.rows) && response.rows[0];
    } catch (error) {
      console.log(error)
    }
  }

  return candidateFound;
}

const createCandidateEvent = async ({ candidateId, eventId }) => {
  const insertCandidateEventResponse = await pool.query('INSERT INTO candidates_events ("candidateId", "eventId", "status") VALUES ($1, $2, $3) RETURNING *', [candidateId, eventId, 'tentative']);
  const newCandidateEventCreated = insertCandidateEventResponse.rows[0];
  return newCandidateEventCreated;
}

const createCandidate = async (candidate) => {
  // Destructure candidate
  const { email } = candidate;

  // Insert Candidate en bd
  const insertCandidateResponse = await pool.query('INSERT INTO candidates ("email") VALUES ($1) RETURNING *;',
    [email]
  );
  const insertedCandidate = insertCandidateResponse.rows[0];

  // Devolver candidate
  return insertedCandidate;
}

module.exports = {
  getCandidateById,
  createCandidate,
  createCandidateEvent,
}