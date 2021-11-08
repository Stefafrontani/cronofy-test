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
        <div className="events">
          <h2 className="events_user">EVENTS for user: <span>{selectedUser && selectedUser.description}</span></h2>
          <ul className="events_list">
            {events.length > 0 && events.map((event, index) => {
              const { start, end, summary, description, status } = event;
              const startDate = new Date(start);
              const endDate = new Date(end);
              return (
                <li className={`event event--${status}`} key={index}>
                  <p className="summary">{summary}</p>
                  <p className="description">{description}</p>
                  <div className="dates">
                    <p className="dates_start">
                      {startDate.toLocaleString(
                        'es-AR',
                        {
                          month: 'short',
                          day: '2-digit',
                          hour: "numeric",
                          minute: "numeric"
                        }
                      )}
                    </p>
                    <span> - </span>
                    <p className="dates_end">
                      {endDate.toLocaleString(
                        'es-AR',
                        {
                          hour: "2-digit",
                          minute: "2-digit"
                        }
                      )}
                    </p>
                  </div>
                  <p className="status">{status}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="table">
        <div className="app">
          <h2>APP ENDPOINTS</h2>
          {window.createTable(eventsPageTablesConfig.app)}
        </div>
        <div className="cronofy"></div>
      </div>
    </div>
  );
}

export default EventsPage;