import React, { useState, useEffect } from 'react';
import DateTimePickerWrapper from '../../components/cronofy/DateTimePickerWrapper/DateTimePickerWrapper';
import { cronofyActions, userActions } from '../../actions';
import { tablesConfig } from '../../helpers';
import './DateTimePickerPage.css';

const { dateTimePickerPageTablesConfig } = tablesConfig;

const { getUsers } = userActions;
const { getElementToken } = cronofyActions;

const availabilityQuery = (subs) => {
  const { must: mustUsers, optional: optionalUsers } = subs;
  let participants = [];

  if (mustUsers.length > 0) {
    participants = [ 
      ...participants,
      {
        required: 'all',
        members: [ ...mustUsers.map(sub => ({ sub })) ]
      }
    ]
  }
  if (optionalUsers.length > 0) {
    participants = [ 
      ...participants,
      {
        required: 1,
        members: [ ...optionalUsers.map(sub => ({ sub })) ]
      }
    ]
  }

  return ({
    participants,
    required_duration: {
      minutes: 60
    },
    query_periods: [
      {
          start: "2021-11-29T18:00:00Z",
          end: "2021-11-29T21:00:00Z"
      },
      {
          start: "2021-12-16T12:00:00Z",
          end: "2021-12-16T17:30:00Z"
      }
    ]
  })
}

const callback = (res, organizerId) => {
  // Check if this is a `slot_selected` notification.
  // If not, we'll return and do nothing.
  if (res.notification.type !== "slot_selected") return;
  
  // Convert the slot info into a URL-safe string.
  const slot = JSON.stringify(res.notification.slot);

  // Load the last page of our app, with the `slot` in the query string.
  window.location.href = `/createEvent?organizerId=${organizerId}&slot=${slot}`;
};

const DateTimePickerPage = () => {
  const [ initialDraggedElement, setInitialDraggedElement ] = useState(null);
  const [ mustUsers, setMustUsers ] = useState([]);
  const [ optionalUsers, setOptionalUsers ] = useState([]);
  const [ elementToken, setElementToken ] = useState(null);
  const [ users, setUsers ] = useState([]);

  const handleGetElementToken = async () => {
    const hasUserSelected = !!(mustUsers.length > 0 || optionalUsers.length > 0);
    if (hasUserSelected) {
      const mustSubs = mustUsers.map(user => user.sub);
      const optionalSubs = optionalUsers.map(user => user.sub);
      const permissions = ["availability"];
      const elementToken = await getElementToken(
        [ ...mustSubs, ...optionalSubs ],
        permissions
      );

      const token = elementToken && elementToken.token;
      setElementToken(token);
    }
  }

  const organizerId = (mustUsers && mustUsers.length > 0) && mustUsers[0].id;

  const DateTimePickerWrapperOptions = {
    element_token: elementToken,
    data_center: process.env.REACT_APP_CRONOFY_DATA_CENTER_ID,
    target_id: "cronofy-date-time-picker",
    availability_query: availabilityQuery({ must: mustUsers.map(user => user.sub), optional: optionalUsers.map(user => user.sub) }),
    callback: (res) => callback(res, organizerId)
  }

  const handleGetUsers = async () => {
    console.log('handleGetUsers');
    const users = await getUsers();
    if (users) {
      setUsers(users)
    }
  }

  const handleDragStart = (event) => {
    console.log('handleDragStart')
    const { target } = event;
    const { dataset } = target;
    const { userid } = dataset;
    target.style.opacity = '0.4';
    
    setInitialDraggedElement(event.target);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', userid);
  }

  const handleDragOver = (event) => {
    console.log('handleDragOver')
    event.stopPropagation();
    event.preventDefault();
    const { target } = event;
  }

  const handleDragEnter = (event) => {
    const { target } = event;
    
  }

  const handleDragLeave = (event) => {
    const { target } = event;
    
  }
  const handleDragEnd = (event) => {
    const { target } = event;

    target.style.opacity = '1';
  }

  const handleDrop = (event) => {
    console.log('handleDrop')
    event.stopPropagation();
    const { target } = event;
    const { dataset } = target;
    const { draggabletype } = dataset;
 
    const childToAppend = document.createElement('li');
    childToAppend.appendChild(initialDraggedElement);
    target.appendChild(childToAppend);
    
    const userId = event.dataTransfer.getData('text/plain');
    const foundUser = users.find(user => user.id == userId);

    draggabletype === 'must'
      ? setMustUsers([ ...mustUsers, foundUser ])
      : setOptionalUsers([ ...optionalUsers, foundUser ])
    return false;
  }

  useEffect(() => {
    handleGetUsers();
  }, [])

  dateTimePickerPageTablesConfig.cronofy.rows[0][dateTimePickerPageTablesConfig.cronofy.rows[0].length - 1].props = { onClick: handleGetElementToken }

  return (
      <div className="dateTimePickerPage">
      {elementToken
        ? <DateTimePickerWrapper options={DateTimePickerWrapperOptions}/>
        : <div className="actionsButtonsContainer">
          <div className="draggableZone">
            <div className="draggableZone__must">
              <h2>OBLIGATORIOS</h2>
              <ul
                draggable
                data-draggabletype="must"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
              </ul>
            </div>
            <div className="draggableZone__optional">
              <h2>OPCIONALES</h2>
              <ul
                draggable
                data-draggabletype="optional"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
              </ul>
            </div>
          </div>
          <div className="users">
            <ul>
              {users.map((user, index) => {
                const [accessToken, profilesNames] = user.description && user.description.split('-');
                const formattedProfilesNames = profilesNames && profilesNames.trim()
                const draggable = !!(user.profiles.length > 0);
                return (
                  <li
                    draggable={draggable}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    key={index}
                    data-userid={user.id}
                  >
                    <div>
                      <p>{accessToken}<span>{formattedProfilesNames}</span></p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
          {window.createTable(dateTimePickerPageTablesConfig.cronofy)}
        </div>
      }
    </div>  
  )
}

export default DateTimePickerPage;

// Subs summary

/* RECENT */
// tech.stefanofrontani  ||	acc_615dfff2e28dc301fe44c8db
// stefanofrontani13     || acc_6169c00ecbd9c3013f21bc2c
// sofia.menshikoff      || acc_6166e8920383bf00fff2660f
// sofia.menshikoff      || acc_61658f0378fae700a2b31f42
// frontani.giacomo      || acc_6161df2e46fba50061d32401

/* PAST */
// stefafrontani         || acc_61658f0378fae700a2b31f42
// tech.stefanofrontani  || acc_6166e8920383bf00fff2660f
// sofia.menshikoff      || acc_6166e8920383bf00fff2660f
// stefanofrontani13     || acc_6169c00ecbd9c3013f21bc2c
    