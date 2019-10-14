import React from 'react';
import axios from 'axios';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import LoginView from './views/LoginView';
import PasswordResetView from "./views/PasswordResetView";
import { Route, Link, Switch } from "react-router-dom";
import withAuthentication from "./components/auth/withAuthentication";
import LoggedInView from './views/LoggedInView';


axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

function App() {
  return (
    <div className={"app bg-light"}>
      <Switch>
        <Route path="/login"><LoginView/></Route>
        <Route path="/password-reset"><PasswordResetView/></Route>
        <Route path="/"><LoggedInView/></Route>
      </Switch>
    </div>
  );
}

export default withAuthentication(App);