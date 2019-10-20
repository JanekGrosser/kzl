import React, { Component } from "react";
import { withRouter } from 'react-router';
import authService from '../../services/authService';

function withAuthentication(WrappedComponent) {
    return withRouter(class extends Component {

        constructor(props) {
            super(props);

            this.state = {
                isAuthenticated: false
            }
        }

        componentDidMount() {
            if(!authService.isLoggedIn()) {
                this.props.history.push("/login");
            } else {
                if (!this.state.isAuthenticated) {
                    this.setState({
                        isAuthenticated: true
                    })
                }
            }
        }

        componentDidUpdate(prevProps, prevState) {
            if(!authService.isLoggedIn()) {
                this.props.history.push("/login");
            } else {
                if (!this.state.isAuthenticated) {
                    this.setState({
                        isAuthenticated: true
                    })
                }
            }
        }
        
        render() {
            return this.state.isAuthenticated ? <WrappedComponent {...this.props}/> : "";
          }
    });
}

export default withAuthentication;