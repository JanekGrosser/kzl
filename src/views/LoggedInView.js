import React, { Component } from "react";
import withAuthentication from "../components/auth/withAuthentication";
import userService from "../services/userService";
import authService from "../services/authService";
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from "axios";

class LoggedInView extends Component {


    constructor(props) {
        super(props);

        this.state = {
            users: [],
            roles: [],
            subdivisions: []
        }

        this.onUserChange = this.onUserChange.bind(this);
    }

    componentDidMount() {
        console.log('asddsa');
        if (authService.isPriviligedRole()) {
            axios.all([
                axios.get('/users'),
                axios.get('/data/roles'),
                axios.get('/data/subdivisions')
            ]).then(axios.spread((usersResp,rolesResp,subdivisionsResp)=> {
                this.setState({
                    users: usersResp.data, 
                    roles: rolesResp.data,
                    subdivisions: subdivisionsResp.data
                })
            }));
        }
    }

    onUserChange(changedUser) {
        var user = this.state.users.find((user) => {
            return user.user_id === changedUser.user_id
        });

        Object.assign(user,changedUser);

        this.setState({
            users: this.state.users //force rerender
        })
        
    }


    render() {
        return (<>
            <Header {...this.state} onUserChange={this.onUserChange}/>
            <main role="main" className="main-view"></main>
            <Footer/>
        </>
        )
    }
}

export default withAuthentication(LoggedInView);