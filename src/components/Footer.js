import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import authService from '../services/authService';

class Footer extends Component {

    constructor(props) {
        super(props);

        this.onLogout = this.onLogout.bind(this);
    }

    onLogout() {
        authService.logOut().then(() => {
            this.props.history.push("/login");
        });
    }

    render() {
        return (
            <footer className="footer">
                <div className="container">
                    <nav className="nav nav-pills nav-stacked">
                        <li className="text-muted">
                            &copy; NetInser, {new Date().getFullYear()}
                        </li>
                        <li className="nav-link">
                            <Link to="/">Strona główna</Link>
                        </li>
                        <li className="nav-link" onClick={this.onLogout}>
                            <Link to="/">Wyloguj się</Link>
                        </li>
                    </nav>
                </div>
            </footer>
        );
    }
}

export default withRouter(Footer);
