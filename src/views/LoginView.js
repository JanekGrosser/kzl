import React, { Component } from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import lang from "../common/lang";

var t = lang().login;

class LoginView extends Component {
    render() {
        return (
            <div className="login-view container">
                <div>
                    <header>
                        <i className="far fa-calendar-alt"></i> 
                        <span>{t.header}</span>
                    </header>
                    <LoginForm/>
                </div>
            </div>
        )
    }
}

export default LoginView;