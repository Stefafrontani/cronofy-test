import React, { useState, useEffect } from 'react';
import CalendarSyncWrapper from '../../components/cronofy/CalendarSyncWrapper/CalendarSyncWrapper';
import { cronofyActions } from '../../actions/cronofy';

const CalendarSyncPage = () => {
  const [elementToken, setElementToken] = useState(null)

  const handleGetElementToken = async () => {
    const cronofyUserItem = localStorage.getItem('cronofyUser');
    if (cronofyUserItem) {
      const cronofyUser = JSON.parse(cronofyUserItem);
      const { sub: cronofyUserSub } = cronofyUser;
      const permissions = ["account_management"];
      const elementToken = await cronofyActions.getElementToken(cronofyUserSub, permissions);

      console.log(elementToken);
      const token = elementToken && elementToken.token;
      setElementToken(token);
    }
  }

  const CalendarSyncOptions = {
    target_id: "cronofy-calendar-sync",
    data_center: process.env.REACT_APP_CRONOFY_DATA_CENTER_ID,
    authorization: {
      redirect_uri: process.env.REACT_APP_CRONOFY_REDIRECT_URI,
      client_id: process.env.REACT_APP_CRONOFY_CLIENT_ID,
      scope: "read_write"
    }
  }

  if (elementToken) {
    CalendarSyncOptions.element_token = elementToken
  }

  return (
    <div className="calendarSyncPage">
      <button onClick={handleGetElementToken}>GET ELEMENT TOKEN</button>
      <CalendarSyncWrapper options={CalendarSyncOptions}/>
    </div>
  );
}

export default CalendarSyncPage;