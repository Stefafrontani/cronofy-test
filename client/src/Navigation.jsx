import React from 'react';
import { Switch, Route } from "react-router-dom";
import SignInPage from './pages/SignInPage/SignInPage';
import CronofyAuthorizationPage from './pages/CronofyAuthorizationPage/CronofyAuthorizationPage';
import AvailabilityPage from './pages/AvailabilityPage/AvailabilityPage';
import CalendarSyncPage from './pages/CalendarSyncPage/CalendarSyncPage';

const Navigation = () => {
  return (
    <Switch>
      <Route component={SignInPage} path="/login" />
      <Route component={CronofyAuthorizationPage} path="/oauth/callback" />
      <Route component={AvailabilityPage} path="/availabilityViewer" />
      <Route component={CalendarSyncPage} path="/calendarSync" />
    </Switch>
  );
}

export default Navigation;