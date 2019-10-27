import React, { Component } from "react";
import withAuthentication from "../components/auth/withAuthentication";
import authService from "../services/authService";
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from "axios";
import { Route } from "react-router-dom";
import UsersComponent from "../components/UsersComponent";
import CurrentCalendar from "../components/calendars/CurrentCalendar";
import BookingCalendar from "../components/calendars/BookingCalendar";

class LoggedInView extends Component {


    constructor(props) {
        super(props);

        this.state = {
            users: [],
            roles: {},
            subdivisions: {}
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
                    roles: rolesResp.data.reduce((acc, curr) => {
                        acc[curr.role_id] = curr.role;
                        return acc;
                    },{}),
                    subdivisions: subdivisionsResp.data.reduce((acc, curr) => {
                        acc[curr.subdivision_id] = curr.subdivision_name;
                        return acc;
                    },{}),
                })
            }));
        }
    }

    onUserDelete(deletedUser) {
        var users = this.state.users.filter((u) => u.user_id !== deletedUser.user_id);
        this.setState({
            users
        })
    }

    onAddUser(addedUser) {
        console.log(addedUser);
        this.state.users.unshift(addedUser);

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
            <Header {...this.state} onAddUser={this.onAddUser}/>
                <main role="main" className="main-view">
                    <Route path="/users">
                        { authService.isPriviligedRole() ? <UsersComponent pageSize={10} {...this.state} onUserChange={this.onUserChange} onUserDelete={this.onUserDelete} ></UsersComponent> : "" }
                    </Route>
                    <Route exact path="/">
                        { authService.isRegularRole() ? <CurrentCalendar/> : ""}
                    </Route>
                    <Route exact path="/booking">
                        { authService.isRegularRole() ? <BookingCalendar/> : ""}
                    </Route>
                </main>
            <Footer/>
        </>
        )
    }
}

export default withAuthentication(LoggedInView);