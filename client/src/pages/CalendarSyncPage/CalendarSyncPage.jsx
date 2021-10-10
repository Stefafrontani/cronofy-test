import React, { useState, useEffect } from 'react';
import CalendarSyncWrapper from '../../components/cronofy/CalendarSyncWrapper/CalendarSyncWrapper';
import { cronofyActions } from '../../actions/cronofy';
import axios from 'axios';

const CalendarSyncOptions = {
  target_id: "cronofy-calendar-sync",
  data_center: process.env.REACT_APP_CRONOFY_DATA_CENTER_URL,
  authorization: {
    redirect_uri: process.env.REACT_APP_CRONOFY_REDIRECT_URI,
    client_id: process.env.REACT_APP_CRONOFY_CLIENT_ID,
    scope: "read_write"
  }
}

const CalendarSyncPage = () => {
  const [elementToken, setElementToken] = useState(null)

  useEffect(async () => {
    const cronofyUserItem = localStorage.getItem('cronofyUser');
    if (cronofyUserItem) {
      const cronofyUser = JSON.parse(cronofyUserItem);
      const { sub: cronofyUserSub } = cronofyUser;
      const elementToken = await cronofyActions.getElementToken(cronofyUserSub);

      setElementToken(elementToken);
    }
  }, [])

  if (elementToken) {
    CalendarSyncOptions.element_token = elementToken
  }
  console.log('CalendarSyncOptions')
  console.log(CalendarSyncOptions)
  return (
    <CalendarSyncWrapper options={CalendarSyncOptions}/>
  );
}

export default CalendarSyncPage;