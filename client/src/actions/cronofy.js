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

const createEvent = (slot) => {
  console.log('createEvent');
  const { start, end, participants } = slot;
  const body = { slot }
  const headers = { "Content-Type": "application/json; charset=utf-8" }

  return axios.post(`${process.env.REACT_APP_COLONY_API_URL}/cronofy/events`, body, { headers })
    .then((response) => {
      const responseData = response.data;
      console.log(responseData)
      return responseData
    })
   .catch(err => console.log(err))
}

export const cronofyActions = {
  getUserInfo,
  refreshToken,
  getElementToken,
  createEvent
};