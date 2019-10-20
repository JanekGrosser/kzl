import React, { Component } from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import l from "../common/lang";

var lang = l();

class LoginView extends Component {
    render() {
        return (
            <main className="login-view container">
                <div>
                    <header>
                        <i className="far fa-calendar-alt"></i> 
                        <span>{lang.brand}</span>
                    </header>
                    <LoginForm/>
                </div>
            </main>
        )
    }
}

export default LoginView;