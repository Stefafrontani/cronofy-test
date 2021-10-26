const { Pool } = require('pg')
const axios = require('axios')
const Cronofy = require('cronofy')
const querysFunctions = require('../helpers/querys')

const { returnArrayOfJson } = querysFunctions;

// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' })

const cronofyClient = new Cronofy({
  client_id: process.env.CRONOFY_CLIENT_ID,
  client_secret: process.env.CRONOFY_CLIENT_SECRET,
  data_center: process.env.CRONOFY_DATA_CENTER_ID
});

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
})

/** CRONOFY */
/** with cronofy client */
const getAccessToken = async (req, res) => {
  console.log('/getAccessToken');

  const reqBody = req.body;
  const authorizationCode = reqBody.code;
  if (authorizationCode) {
    const userInfo = await cronofyClient.requestAccessToken({
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: process.env.CRONOFY_REDIRECT_URI
    }).catch((err) => {
      console.error(err);
    });

    const cronofyUser = await signUp(userInfo);
    res.send(cronofyUser)
  }
}

const refreshAccessToken = async (req, res) => {
  console.log('/refreshAccessToken');

  const reqBody = req.body;
  const userId = reqBody.userId;
  if (userId) {
    const user = await getUserById(userId);
    const cronofyUserInfo = await cronofyClient.refreshAccessToken({
      client_id: process.env.CRONOFY_CLIENT_ID,
      client_secret: process.env.CRONOFY_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: user.refreshToken
    }).catch((err) => {
      console.error(err);
    });

    const { access_token } = cronofyUserInfo;
    const response = await pool.query(`UPDATE users SET "accessToken" = $1 WHERE id = $2 RETURNING *;`, [access_token, userId])
    
    const userUpdated = response && response.rows && response.rows[0];

    res.send(userUpdated)
  }
}

const getUserInfo = async (req, res) => {
  console.log('getUserInfo');
  const reqParams = req.params;
  const userId = reqParams.userId;

  const userFound = await getUserById(userId);

  const accessToken = userFound.accessToken;

  const headers = {
    // "Content-Type": "application/json; charset=utf-8",
    // "Host": process.env.CRONOFY_DATA_CENTER_URL,
    "Authorization": `Bearer ${accessToken}`
  }

  axios.get(`${process.env.CRONOFY_DATA_CENTER_URL}/v1/userinfo`, { headers })
    .then((response) => {
      const userInfo = response.data;
      console.log('userInfo')
      console.log(userInfo);
      res.send(userInfo);
    })
   .catch(err => {
     console.log('ERROR')
     console.log(err)
   })
}

const getElementToken = async (req, res) => {
  const { subs, permissions } = req.body;

  const cronofyClient = new Cronofy({
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID
  });

  try {
    const requestElementTokenOptions = {
      version: "1",
      permissions: permissions,
      subs: subs,
      origin: process.env.COLONY_ORIGIN
    }
    const requestElementTokenResponse = await cronofyClient.requestElementToken(requestElementTokenOptions)
    const elementToken = requestElementTokenResponse.element_token
    res.send(elementToken);
  } catch (error) {
    console.log('error', error)
  }
}

const createEvent = async (req, res) => {
  const reqBody = req.body;
  const slot = reqBody.slot || {};
  const { start, end, participants, attendees } = slot;
  
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
        }
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

/** NO cronofy client */
const getAccessTokenNCC = async (req, res) => {
  console.log('/getAccessToken');

  const reqBody = req.body;
  const authorizationCode = reqBody.code;

  const bodyToSend = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    grant_type: "authorization_code",
    code: authorizationCode,
    redirect_uri: process.env.CRONOFY_REDIRECT_URI
  }
  const headers = { "Content-Type": "application/json; charset=utf-8" }
  
  axios.post(`${process.env.CRONOFY_DATA_CENTER_ID}/oauth/token`, bodyToSend, { headers })
  .then(async (response) => {
    const userProfile = response.data;
    console.log(userProfile)
    const signUpResponse = await signUp(userProfile);
    console.log(signUpResponse)
  })
  .catch(err => console.log(err))
}

const signUp = async (cronofyUser) => {
  console.log('signUp')
  let res;
  
  const {
    account_id, 
    access_token,
    refresh_token,
    sub,
    linking_profile,
    expires_in,
    token_type,
    scope,
  } = cronofyUser;

   const {
    provider_name,
    profile_id,
    profile_name,
    provider_service
  } = linking_profile;

  // Busco user por accountId
  const userResponse = await pool.query('SELECT * from users WHERE "accountId"=$1', [account_id]);
  const userFound = userResponse.rows && userResponse.rows[0]
  // console.log('select user response')
  // console.log(userResponse)
  
  if (userFound) {
    res = { ...res, user: userFound }
    // SI encuentro: 
    // Busco su profileId
    const userId = userFound.id;
    const profileResponse = await pool.query('SELECT * from profiles WHERE "userId" = $1 AND "profileId" = $2;', [userId, profile_id]);
    const profileFound = profileResponse.rows && profileResponse.rows[0];
    // console.log('select profile response');
    // console.log(profileResponse);

    if (profileFound) {
      // SI match
      // No hago nada
      res = { ...res, profile: profileFound}
    } else {
      // NO match
      // Inserto nuevo profile
      const insertProfileResponse = await pool.query('INSERT INTO profiles ("userId", "providerName", "profileId", "profileName", "providerService") VALUES ($1, $2, $3, $4, $5) RETURNING *', [userId, provider_name, profile_id, profile_name, provider_service])
      const profileInserted = insertProfileResponse.rows && insertProfileResponse.rows[0];
      res = { ...res, profile: profileInserted } 
    }
  } else {
  // NO encuentro
    // INSERT usuario en USERS
    const insertUserResponse = await pool.query('INSERT INTO users (sub, "accessToken", "refreshToken", "accountId") VALUES ($1, $2, $3, $4) RETURNING *', [sub, access_token, refresh_token, account_id])
    const userInserted = insertUserResponse.rows && insertUserResponse.rows[0];
    const insertedUserId = userInserted.id;
    // INSERT profile en PROFILES
    const insertProfileResponse = await pool.query('INSERT INTO profiles ("userId", "providerName", "profileId", "profileName", "providerService") VALUES ($1, $2, $3, $4, $5) RETURNING *', [insertedUserId, provider_name, profile_id, profile_name, provider_service])
    const profileInserted = insertProfileResponse.rows && insertProfileResponse.rows[0]
  
    res = { ...res, user: userInserted, profile: profileInserted }
  }

  return res
}

const getUsers = async (req, res) => {
  console.log('getUsers');
  // const response = await pool.query(
  //   `
  //     SELECT
  //       "id",
  //       (
  //         SELECT array_to_json(array_agg(row_to_json(x)))
  //         FROM (
  //           SELECT p."profileName"
  //           FROM profiles p
  //           INNER JOIN users u
  //           ON u.id = p."userId"
  //         ) x
  //       ) as profiles
  //     FROM users u
  //   ;`
  // );

  // SELECT row_to_json(x) from (SELECT id, "accessToken" FROM users) x; ::  (many records each containing one value)
  //  {"id":2,"accessToken":"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR"}
  //  {"id":3,"accessToken":"Cs005Nq3fYtaW83OTVNqMFl-yzK_MpeS"}
  //  {"id":1,"accessToken":"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR"}
  //  {"id":6,"accessToken":"KqJkeKjHN1CTATSPfz5eS4a5usISQT3t"}

  // SELECT array_agg(row_to_json(x)) from (SELECT id, "accessToken" FROM users) x;  ::  (one record back containing an Array of values, instead of many records each containing one value)
  // {
  //   "{\"id\":2,\"accessToken\":\"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR\"}",
  //   "{\"id\":3,\"accessToken\":\"Cs005Nq3fYtaW83OTVNqMFl-yzK_MpeS\"}",
  //   "{\"id\":1,\"accessToken\":\"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR\"}",
  //   "{\"id\":6,\"accessToken\":\"KqJkeKjHN1CTATSPfz5eS4a5usISQT3t\"}"
  // }

  // SELECT array_to_json(array_agg(row_to_json(x))) from (SELECT id, "accessToken" FROM users) x;
  // [
  //   {"id":2,"accessToken":"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR"},
  //   {"id":3,"accessToken":"Cs005Nq3fYtaW83OTVNqMFl-yzK_MpeS"},
  //   {"id":1,"accessToken":"1uXq6QrYB-dRhIZ_fBz3JDrjROq-dSoR"},
  //   {"id":6,"accessToken":"KqJkeKjHN1CTATSPfz5eS4a5usISQT3t"}
  // ]

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
  getAccessToken,
  refreshAccessToken,
  getUserInfo,
  getElementToken,
  createEvent,
  getAccessTokenNCC,
  signUp,
  getUsers,
  getUserById
}

// NCC = No Cronocy Client