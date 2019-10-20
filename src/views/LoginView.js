import React, { Component } from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import lang from "../common/lang";

var c = lang().common;

class LoginView extends Component {
    render() {
        return (
            <main className="login-view container">
                <div>
                    <header>
                        <i className="far fa-calendar-alt"></i> 
                        <span>{c.brand}</span>
                    </header>
                    <LoginForm/>
                </div>
            </main>
        )
    }
}

export default LoginView;