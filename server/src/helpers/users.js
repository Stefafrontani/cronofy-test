// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' });

const Cronofy = require('cronofy');
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB
});

const getUserById = async ({ userId, accountId, sub }) => {
  console.log('getUserById');
  let userFound = null;
  if (userId) {
    try {
      const response = await pool.query(`SELECT * FROM users WHERE id=$1`, [userId])
      userFound = (response && response.rows) && response.rows[0];
    } catch (error) {
      console.log(error)
    }
  }
  if (accountId && !userFound) {
    try {
      const response = await pool.query(`SELECT * FROM users WHERE "accountId"=$1`, [accountId])
      userFound = (response && response.rows) && response.rows[0];
    } catch (error) {
      console.log(error)
    }
  }
  if (sub && !userFound) {
    try {
      const response = await pool.query(`SELECT * FROM users WHERE sub=$1`, [sub])
      userFound = (response && response.rows) && response.rows[0];
    } catch (error) {
      console.log(error)
    }
  }

  return userFound;
}

const getUserInfo = async (accessToken) => {
  let userInfo = {};
  
  const cronofyClientOptions = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID,
    access_token: accessToken
  };

  const cronofyClient = new Cronofy(cronofyClientOptions);

  try {
    userInfo = await cronofyClient.userInfo();
  } catch (error) {
    console.log(error)
  }

  return userInfo;
}


const getUserProfile = async (userId) => {
  console.log('getUserProfile helper');
  let userProfile = {};
  try {
    const selectUserProfileResponse = await pool.query(`SELECT * FROM profiles WHERE "userId" = $1`, [userId])
    userProfile = (selectUserProfileResponse && selectUserProfileResponse.rows) && selectUserProfileResponse.rows[0];
  } catch (error) {
    console.log(error)
  }

  console.log(userProfile);
  return userProfile;
}

/** getUserInfoNCC */
const getUserNotificationsChannels = async ({ userId }) => {
  console.log('getUserNotificationsChannels helper');
  
  const userFound = await getUserById({ userId });
  const { accessToken } = userFound;
  
  const cronofyClientOptions = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID,
    access_token: accessToken
  };

  const cronofyClient = new Cronofy(cronofyClientOptions);

  try {
    const userNotificationsChannels = await cronofyClient.listNotificationChannels();
    return userNotificationsChannels;
  } catch (error) {
    console.log(error)
  }
}

const deleteNotificationsChannel = async ({ userId, channelId }) => {
  console.log('deleteUserNotificationsChannel helper');
  console.log('userId');
  console.log(userId);
  console.log('channelId');
  console.log(channelId);
  
  const userFound = await getUserById({ userId });
  const { accessToken } = userFound;
  
  const cronofyClientOptions = {
    client_id: process.env.CRONOFY_CLIENT_ID,
    client_secret: process.env.CRONOFY_CLIENT_SECRET,
    data_center: process.env.CRONOFY_DATA_CENTER_ID,
    access_token: accessToken
  };

  const cronofyClient = new Cronofy(cronofyClientOptions);

  try {
    const userNotificationsChannels = await cronofyClient.deleteNotificationChannel({ channel_id: channelId });
    return userNotificationsChannels;
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUserInfo,
  getUserById,
  getUserProfile,
  getUserNotificationsChannels,
  deleteNotificationsChannel
}