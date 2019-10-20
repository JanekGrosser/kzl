import React, { Component } from "react";
import withAuthentication from "../components/auth/withAuthentication";
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
        this.onAddUser = this.onAddUser.bind(this);
        this.onUserDelete = this.onUserDelete.bind(this);
    }

    componentDidMount() {
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

    onUserDelete(deletedUser) {
        console.log("KURWAAA");
        console.log(deletedUser);
        var users = this.state.users.filter((u) => u.user_id !== deletedUser.user_id);
        this.setState({
            users
        })
    }

    onAddUser(addedUser) {
        this.state.users.push(addedUser);

        this.setState({
            users: this.state.users
        })
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
            <Header {...this.state} onUserChange={this.onUserChange} onUserDelete={this.onUserDelete}/>
            <main role="main" className="main-view"></main>
            <Footer/>
        </>
        )
    }
}

export default withAuthentication(LoggedInView);