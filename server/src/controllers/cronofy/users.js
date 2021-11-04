// dotenv package - use .env file
require('dotenv').config({ path: './src/.env' })

const axios = require('axios');
const Cronofy = require('cronofy');
const cronofyClient = new Cronofy({
  client_id: process.env.CRONOFY_CLIENT_ID,
  client_secret: process.env.CRONOFY_CLIENT_SECRET,
  data_center: process.env.CRONOFY_DATA_CENTER_ID
});

const { users } = require('../../helpers');
const { getUserById, getUserInfo, getUserNotificationsChannels, deleteNotificationsChannel } = users;

/** getUserInfoNCC */
const getUserInfoNCCRoute = async (req, res) => {
  console.log('getUserInfo');
  const reqParams = req.params;
  const userId = reqParams.userId;

  const userFound = await getUserById({ userId });
  const { accessToken } = userFound;
  const userInfo = await getUserInfo(accessToken);

  res.send(userInfo);
}

/** getUserInfoNCC */
const getUserNotificationsChannelsRoute = async (req, res) => {
  console.log('getUserInfo');
  const reqParams = req.params;
  const userId = reqParams.userId;

  const userNotificationsChannels = await getUserNotificationsChannels({ userId });

  res.send(userNotificationsChannels);
}

const deleteNotificationsChannelRoute = async (req, res) => {
  console.log('deleteNotificationsChannelRoute');
  
  const reqParams = req.params;
  const { userId, channelId } = reqParams;

  const userNotificationsChannels = await deleteNotificationsChannel({ userId, channelId });

  res.send(userNotificationsChannels);
}

module.exports = {
  getUserInfoRoute: getUserInfoNCCRoute,
  getUserNotificationsChannelsRoute,
  deleteNotificationsChannelRoute
};