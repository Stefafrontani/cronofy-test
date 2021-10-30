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
const { getUserById } = users;

/** getUserInfoNCC */
const getUserInfoNCC = async (req, res) => {
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

module.exports = {
  getUserInfo: getUserInfoNCC
};