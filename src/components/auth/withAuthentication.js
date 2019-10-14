import React, { Component } from "react";
import { withRouter } from 'react-router';
import authService from '../../services/authService';

function withAuthentication(WrappedComponent) {
    return withRouter(class extends Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            if(!authService.isLoggedIn()) {
                this.props.history.push("/login");
            }
        }
        
        render() {
            return <WrappedComponent {...this.props} />;
          }
    });
}

export default withAuthentication;