import React, { Component } from "react";
import axios from "axios";
import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import LoginView from "./views/LoginView";
import PasswordResetView from "./views/PasswordResetView";
import { Route, Switch, withRouter } from "react-router-dom";
import authService from "./services/authService";
import LoggedInView from "./views/LoggedInView";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

class App extends Component {

    render() {
        return (
            <div className={"app bg-light"}>
                <Switch>
                    <Route path="/login">
                        <LoginView />
                    </Route>
                    <Route path="/password-reset">
                        <PasswordResetView />
                    </Route>
                    <Route path="/">
                        <LoggedInView />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default withRouter(App);
