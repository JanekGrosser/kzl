import React, { Component } from 'react';
import lang from "../../common/lang";
import authService from "../../services/authService";

var l = lang();

class UserHeader extends Component {
    render() {
        return (
            <div className="calendar-header">
                <h2>{l.summaryDaily}</h2>
                <h3>
                    {authService.getUsername()} - ({authService.getUserCSR()})
                </h3>
            </div>
        );
    }
}

export default UserHeader;