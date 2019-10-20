import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import authService from '../services/authService';
import l from "../common/lang";

var lang = l();

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
                            &copy; {lang.brand}, {new Date().getFullYear()}
                        </li>
                        <li className="nav-link">
                            <Link to="/">{lang.homeView}</Link>
                        </li>
                        <li className="nav-link" onClick={this.onLogout}>
                            <Link to="/">{lang.logout}</Link>
                        </li>
                    </nav>
                </div>
            </footer>
        );
    }
}

export default withRouter(Footer);
