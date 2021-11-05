import React from 'react';
import { Switch, Route } from "react-router-dom";
import CalendarSyncPage from './pages/CalendarSyncPage/CalendarSyncPage';
import CreateEventPage from './pages/CreateEventPage/CreateEventPage';
import CronofyAuthorizationPage from './pages/CronofyAuthorizationPage/CronofyAuthorizationPage';
import DateTimePickerPage from './pages/DateTimePickerPage/DateTimePickerPage';
import EndpointsPage from './pages/EndpointsPage/EndpointsPage';
import EventsPage from './pages/EventsPage/EventsPage';
import SignInPage from './pages/SignInPage/SignInPage';

const Navigation = () => {
  return (
    <Switch>
      <Route component={CalendarSyncPage} path="/calendarSync" />
      <Route component={CreateEventPage} path="/createEvent" />
      <Route component={CronofyAuthorizationPage} path="/oauth/callback" />
      <Route component={DateTimePickerPage} path="/dateTimePicker" />
      <Route component={EndpointsPage} path="/endpoints" />
      <Route component={EventsPage} path="/events" />
      <Route component={SignInPage} path="/login" />
    </Switch>
  );
}

export default Navigation;