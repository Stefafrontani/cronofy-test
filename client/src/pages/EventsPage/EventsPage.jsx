import React, { useEffect, useState } from 'react';
import { userActions } from '../../actions';
import { tablesConfig } from '../../helpers';
import './EventsPage.css';

const { eventsPageTablesConfig } = tablesConfig;

const { getUsers, getEvents } = userActions;

const EventsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [events, setEvents] = useState([]);

  const handleSetSelectedUser = (event) => {
    console.log('handleSetSelectedUser');
    const selectedUserId = event.target.value
    const selectedUser = users.find(user => user.id == selectedUserId);
    setSelectedUser(selectedUser)
  }

  /** APPLICATION */
  const handleGetUsers = async () => {
    console.log('handleGetUsers');
    const users = await getUsers();
    if (users && users.length) {
      setUsers(users)
    }
  }

  const handleGetEvents = async () => {
    console.log('handleGetEvents');
    const { id: userId } = selectedUser;
    const events = await getEvents(userId);
    if (events && events.length) {
      setEvents(events)
    }
  }

  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      const { id: userId } = selectedUser;
      handleGetEvents(userId);
    }
  }, [selectedUser]);

  useEffect(() => {
    handleGetUsers();
  }, []);

  useEffect(() => {
    if (users.length) {
      setSelectedUser(users[0])
    }
  }, [users]);

  eventsPageTablesConfig.app.rows[0][eventsPageTablesConfig.app.rows[0].length - 1].props = { onClick: handleGetEvents }

  return (
    <div className="eventsPage">
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
          <h2>EVENTS for user: {selectedUser && selectedUser.description}</h2>
          <ul>
            {events.length > 0 && events.map((event, index) => {
              const { start, end, summary, description, status } = event;
              return (
                <li key={index}>
                  <p>{start}</p>
                  <p>{end}</p>
                  <p>{summary}</p>
                  <p>{description}</p>
                  <p>{status}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <h2>APP ENDPOINTS</h2>
      <h3>EVENTS</h3>
      {window.createTable(eventsPageTablesConfig.app)}
    </div>
  );
}

export default EventsPage;