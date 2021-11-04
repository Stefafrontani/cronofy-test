const axios = require('axios');

const getUserInfo = (userId) => {
  console.log('getUserInfo');
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  }

  return axios.get(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/users/${userId}/info`, { headers })
    .then((response) => {
      const userInfo = response.data;
      return userInfo
    })
   .catch(err => console.log(err))
}

const refreshToken = (userId) => {
  console.log('refreshToken');
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  }

  const body = { userId }
  return axios.post(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/auth/token/refresh`, body, { headers })
    .then((response) => {
      const userInfo = response.data;
      localStorage.setItem('cronofyUser', JSON.stringify(userInfo))
      return userInfo
    })
   .catch(err => console.log(err))
}

const getElementToken = (subs, permissions) => {
  console.log('getElementToken');
  const headers = { "Content-Type": "application/json; charset=utf-8" }

  return axios.post(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/auth/elementToken`, { subs, permissions }, { headers })
    .then((response) => {
      const elementToken = response.data;
      console.log(elementToken)
      return elementToken
    })
   .catch(err => console.log(err))
}

const createEvent = (newEvent) => {
  console.log('createEvent');
  const body = { newEvent }
  const headers = { "Content-Type": "application/json; charset=utf-8" }

  return axios.post(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/events`, body, { headers })
    .then((response) => {
      const responseData = response.data;
      console.log(responseData)
      return responseData
    })
   .catch(err => console.log(err))
}

const createNotificationsChannel = (userId) => {
  console.log('createNotificationsChannel');
  const headers = { "Content-Type": "application/json; charset=utf-8" }
  const body = { userId };

  return axios.post(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/events/notifications`, body, headers)
  .then((response) => {
    const responseData = response.data;
    console.log(responseData);
    return responseData
  })
 .catch(err => console.log(err))
}

const getUserNotificationsChannels = ({ userId }) => {
  console.log('getUserNotificationsChannels');
  const headers = { "Content-Type": "application/json; charset=utf-8" }
  const body = { userId };

  return axios.get(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/users/${userId}/notifications`, body, headers)
  .then((response) => {
    const responseData = response.data;
    console.log(responseData);
    return responseData
  })
 .catch(err => console.log(err))
}

const deleteNotificationsChannel = ({ userId, channelId }) => {
  console.log('deleteNotificationsChannel');
  const headers = { "Content-Type": "application/json; charset=utf-8" }
  const body = { channelId };

  return axios.delete(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/users/${userId}/notifications/${channelId}`, body, headers)
  .then((response) => {
    const responseData = response.data;
    console.log(responseData);
    return responseData
  })
 .catch(err => console.log(err))
}

export const cronofyActions = {
  getUserInfo,
  refreshToken,
  getElementToken,
  createEvent,
  createNotificationsChannel,
  getUserNotificationsChannels,
  deleteNotificationsChannel,
};