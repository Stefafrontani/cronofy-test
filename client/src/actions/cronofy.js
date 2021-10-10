const axios = require('axios');

const getElementToken = (cronofyUserSub) => {
  console.log('getElementToken');
  const headers = { "Content-Type": "application/json; charset=utf-8" }

  axios.post(`${process.env.REACT_APP_COLONY_API_URL}/elementToken`, { cronofyUserSub }, { headers })
    .then(async (response) => {
      const responseData = response.data;
      console.log(responseData);
    })
   .catch(err => console.log(err))
}

export const cronofyActions = {
  getElementToken
};