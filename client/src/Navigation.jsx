import React from 'react';
import { Switch, Route } from "react-router-dom";
import SignInPage from './pages/SignInPage/SignInPage';
import CronofyAuthorizationPage from './pages/CronofyAuthorizationPage/CronofyAuthorizationPage';
import CalendarSyncPage from './pages/CalendarSyncPage/CalendarSyncPage';
import DateTimePickerPage from './pages/DateTimePickerPage/DateTimePickerPage';
import CreateEventPage from './pages/CreateEventPage/CreateEventPage';
import EndpointsPage from './pages/EndpointsPage/EndpointsPage';

const Navigation = () => {
  return (
    <Switch>
      <Route component={SignInPage} path="/login" />
      <Route component={CalendarSyncPage} path="/calendarSync" />
      <Route component={DateTimePickerPage} path="/dateTimePicker" />
      <Route component={EndpointsPage} path="/endpoints" />
      <Route component={CronofyAuthorizationPage} path="/oauth/callback" />
      <Route component={CreateEventPage} path="/createEvent" />
    </Switch>
  );
}

export default Navigation;