import React, { useEffect, useState } from 'react';
import { cronofyActions, userActions } from '../../actions';
import { tablesConfig } from '../../helpers';
import './EndpointsPage.css';

const { endpointsPageTablesConfig } = tablesConfig;

const { getUsers } = userActions;
const { getUserInfo, refreshToken, getUserNotificationsChannels, createNotificationsChannel, deleteNotificationsChannel } = cronofyActions;

const EndpointsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userNotificationsChannels, setUserNotificationsChannels] = useState([]);
  const [selectedUserNotificationsChannel, setSelectedUserNotificationsChannel] = useState(null);

  const handleSetSelectedUser = (event) => {
    console.log('handleSetSelectedUser');
    const selectedUserId = event.target.value
    const selectedUser = users.find(user => user.id == selectedUserId);
    setSelectedUser(selectedUser)
  }

  const handleSetUserNotificationsChannel = (event) => {
    console.log('handleSetUserNotificationsChannel');
    const selectedUserNotificationId = event.target.value
    const selectedUserNotificationsChannel = userNotificationsChannels.find(userNotificationsChannel => userNotificationsChannel.channel_id == selectedUserNotificationId);
    setSelectedUserNotificationsChannel(selectedUserNotificationsChannel)
  }

  /** CRONOFY */
  const handleGetUserInfo = async () => {
    const selectedUserId = selectedUser.id;
    const userInfo = await getUserInfo(selectedUserId);
    console.log(userInfo);
  }

  const handleRefreshToken = async () => {
    console.log('handleRefreshToken');
    const selectedUserId = selectedUser.id; 
    const userUpdated = await refreshToken(selectedUserId);
  }
  
  const handleGetUserNotificationsChannels = async () => {
    const { id: userId } = selectedUser;
    const userNotificationsChannelsResponse = await getUserNotificationsChannels({ userId });
    const { channels: userNotificationsChannels } = userNotificationsChannelsResponse;
    setUserNotificationsChannels(userNotificationsChannels);
  }

  const handleCreateNotificationsChannel = () => {
    const selectedUserId = selectedUser.id;
    createNotificationsChannel(selectedUserId);
  }

  const handleDeleteNotificationsChannels = async () => {
    const { id: userId } = selectedUser;
    const { channel_id: channelId } = selectedUserNotificationsChannel;
    const userNotificationsChannelsResponse = await deleteNotificationsChannel({ userId, channelId: channelId });
  }

  /** APPLICATION */
  const handleGetUsers = async () => {
    const users = await getUsers();
    if (users) {
      setUsers(users)
    }
  }

  useEffect(() => {
    handleGetUsers();
  }, []);

  useEffect(() => {
    if (users.length) {
      setSelectedUser(users[0])
    }
  }, [users])

  useEffect(() => {
    if (userNotificationsChannels && userNotificationsChannels.length) {
      setSelectedUserNotificationsChannel(userNotificationsChannels[0])
    }
  }, [userNotificationsChannels])
  
  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      handleGetUserNotificationsChannels();
    }
  }, [selectedUser]);

  endpointsPageTablesConfig.cronofy.rows[0][endpointsPageTablesConfig.cronofy.rows[0].length - 1].props = { onClick: handleGetUserInfo }
  endpointsPageTablesConfig.cronofy.rows[1][endpointsPageTablesConfig.cronofy.rows[1].length - 1].props = { onClick: handleRefreshToken }
  endpointsPageTablesConfig.cronofy.rows[2][endpointsPageTablesConfig.cronofy.rows[2].length - 1].props = { onClick: handleGetUserNotificationsChannels }
  endpointsPageTablesConfig.cronofy.rows[3][endpointsPageTablesConfig.cronofy.rows[3].length - 1].props = { onClick: handleDeleteNotificationsChannels }
  endpointsPageTablesConfig.cronofy.rows[4][endpointsPageTablesConfig.cronofy.rows[4].length - 1].props = { onClick: handleCreateNotificationsChannel }

  endpointsPageTablesConfig.app.rows[0][endpointsPageTablesConfig.app.rows[0].length - 1].props = { onClick: handleGetUsers }

  return (
    <div className="endpointsPage">
      <div>
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
        <div>
          {userNotificationsChannels && userNotificationsChannels.length
            ? (
              <select onChange={handleSetUserNotificationsChannel}>
                {userNotificationsChannels.map((userNotificationsChannel, index) => {
                  return (
                    <option value={userNotificationsChannel.channel_id} key={index}>{userNotificationsChannel && userNotificationsChannel.callback_url}</option>
                    );
                  })}
              </select>
            )
            : null
          }
        </div>
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