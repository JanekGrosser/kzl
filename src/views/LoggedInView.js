import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import authService from "../services/authService";

class LoggedInView extends Component {
    render() {
        return <div>
            <button onClick={() => {
                authService.logOut().then(() => {
                    this.props.history.push("/login");
                })
            }}/>
        </div>
    }
}

export default withRouter(LoggedInView);