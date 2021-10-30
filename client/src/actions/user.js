const axios = require('axios');

const getUsers = () => {
  console.log('getUsers');
  const headers = { "Content-Type": "application/json; charset=utf-8" }

  return axios.get(`${process.env.REACT_APP_COLONY_API_URL}/app/users`, { headers })
    .then((response) => {
      const users = response.data;
      const usersFormatted = users.map((user) => {
        const defaultAcc = user.profiles ? `${user.sub} - ` : user.sub;
        return ({
          ...user,
          description: user.profiles && user.profiles.length > 0 ?
            user.profiles.reduce((acc, curr) => {

              const { profileName } = curr || '';
              return `${acc} ${profileName} `
            }, defaultAcc)
            : 'No profiles associated'
        })
      })
      return usersFormatted;
    })
   .catch(err => console.log(err))
}

const getUserById = (userId) => {
  console.log('getUserById');
  const headers = { "Content-Type": "application/json; charset=utf-8" }

  return axios.get(`${process.env.REACT_APP_COLONY_API_URL}/app/users/${userId}`, { headers })
    .then(async (response) => {
      const userFound = response.data;
      return userFound;
    })
   .catch(err => console.log(err))
}

export const userActions = {
  getUsers,
  getUserById
};