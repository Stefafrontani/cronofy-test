import React, { useEffect, useState } from 'react';
import { cronofyActions, userActions } from '../../actions';
import './EndpointsPage.css'

const { getUsers, getUserById } = userActions;
const { getUserInfo, refreshToken } = cronofyActions;

const headers = [ "url", "description", "cronofy-client-options", "cronofy-client-method", "cronofy-client-method-options", "query", "body", "call"];
const cronofyEndpointsRows = [
  [
    "GET: /users/3/info",
    ["Cronofy endpoint:", "Request to return user info"],
    "----",
    "----",
    "----",
    "userId",
    "----",
    {
      html: "GET USER INFO",
      component: 'button',
      props: {}
    }
  ],
  [
    "GET: /oauth/token/refresh",
    ["Cronofy endpoint", "request to refresh access token"],
    "----",
    "----",
    "----",
    "----",
    "userId",
    {
      html: "REFRESH TOKEN",
      component: 'button',
      props: {}
    }
  ]
]
const appEndpointsRows = [
  [
    "GET: /users",
    ["App endpoint", "Request to get users", "Done on mount"],
    "----",
    "----",
    "----",
    "userId",
    "----",
    {
      html: "GET USERS",
      component: 'button',
      props: {}
    }
  ]
]

const cronofyEndpointsTableConfig = {
  "headers": headers,
  rows: cronofyEndpointsRows
}
const appEndpointsTableConfig = {
  "headers": headers,
  rows: appEndpointsRows
}

const EndpointsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSetSelectedUser = (event) => {
    console.log('handleSetSelectedUser');
    const selectedUserId = event.target.value
    const selectedUser = users.find(user => user.id == selectedUserId)
    setSelectedUser(selectedUser)
  }

  useEffect(() => {
    if (users.length) {
      setSelectedUser(users[0])
    }
  }, [users])

  /** CRONOFY */
  const handleGetUserInfo = async () => {
    console.log('handleGetUserInfo');
    const selectedUserId = selectedUser.id; 
    const userInfo = await getUserInfo(selectedUserId);
    console.log(userInfo);
  }

  const handleRefreshToken = async () => {
    console.log('handleRefreshToken');
    const selectedUserId = selectedUser.id; 
    const userUpdated = await refreshToken(selectedUserId);
    console.log(userUpdated)
  }

  /** APPLICATION */
  const handleGetUsers = async () => {
    console.log('handleGetUsers');
    const users = await getUsers();
    if (users) {
      setUsers(users)
    }
  }

  useEffect(() => {
    handleGetUsers();
  }, []);

  cronofyEndpointsTableConfig.rows[0][cronofyEndpointsTableConfig.rows[0].length - 1].props = { onClick: handleGetUserInfo }
  cronofyEndpointsTableConfig.rows[1][cronofyEndpointsTableConfig.rows[1].length - 1].props = { onClick: handleRefreshToken }
  
  appEndpointsTableConfig.rows[0][appEndpointsTableConfig.rows[0].length - 1].props = { onClick: handleGetUsers }

  return (
    <div className="endpointsPage">
      <div>
        {users && users.length
          ? (
            <select onChange={handleSetSelectedUser}>
              {users.map((user, index) => {
                return (
                  <option value={user.id} key={index}>{user && user.description}</option>
                );
              })}
            </select>
          )
          : null
        }
      </div>
      <h2>Cronofy ENDPOINTS</h2>
      {window.createTable(cronofyEndpointsTableConfig)};
      <h2>APP ENDPOINTS</h2>
      <h3>USERS</h3>
      {window.createTable(appEndpointsTableConfig)};
    </div>
  );
}

export default EndpointsPage;