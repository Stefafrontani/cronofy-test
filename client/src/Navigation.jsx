import React from 'react';
import { Switch, Route } from "react-router-dom";
import SignInPage from './pages/SignInPage/SignInPage';
import CronofyAuthorizationPage from './pages/CronofyAuthorizationPage/CronofyAuthorizationPage';

const Navigation = () => {
  return (
    <Switch>
      <Route component={SignInPage} path="/login" />
      <Route component={CronofyAuthorizationPage} path="/oauth/callback" />
    </Switch>
  );
}

export default Navigation;