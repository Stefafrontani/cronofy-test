import React, { useEffect, useState } from 'react';
import { cronofyActions, userActions } from '../../actions';
import { tablesConfig } from '../../helpers';
import './EndpointsPage.css';

const { endpointsPageTablesConfig } = tablesConfig;


const { getUsers, getUserById } = userActions;
const { getUserInfo, refreshToken } = cronofyActions;

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

  endpointsPageTablesConfig.cronofy.rows[0][endpointsPageTablesConfig.cronofy.rows[0].length - 1].props = { onClick: handleGetUserInfo }
  endpointsPageTablesConfig.cronofy.rows[1][endpointsPageTablesConfig.cronofy.rows[1].length - 1].props = { onClick: handleRefreshToken }
  
  endpointsPageTablesConfig.app.rows[0][endpointsPageTablesConfig.app.rows[0].length - 1].props = { onClick: handleGetUsers }

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
      {window.createTable(endpointsPageTablesConfig.cronofy)};
      <h2>APP ENDPOINTS</h2>
      <h3>USERS</h3>
      {window.createTable(endpointsPageTablesConfig.app)};
    </div>
  );
}

export default EndpointsPage;