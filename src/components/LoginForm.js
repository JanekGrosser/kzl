import React, { Component } from "react";
import authService from "../services/authService";
import lang from "../common/lang"
import { withRouter, Link } from "react-router-dom";

var t = lang().login;
var c = lang().common;

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            csr: "",
            password: "",
            error: ""
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(evt) {
        evt.preventDefault();
        authService.logIn(this.state.csr,this.state.password)
            .then(() => {
                this.props.history.push("/");
            })
            .catch((err) => {
                var error;
                switch(err.response.status) {
                    case 400: 
                        error = t.missingCredentials;
                        break;
                    case 401:
                        error = t.wrongCredentials;
                        break;
                    default:
                        error = c.serverError;
                        break;
                }            
                this.setState({ error });
            });
    }

    onChange(e) {
        var name = e.target.name;
        var val = e.target.value;
        this.setState({
            [name]: val
        })
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.state.error ? <div className="alert alert-danger" role="alert">{this.state.error}</div> : ""}
                <div className="form-group">
                    <input type="text" className="form-control" name="csr" id="csr" placeholder={c.csrPlaceholder} value={this.state.csr} onChange={this.onChange}></input>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" name="password" id="password" placeholder={c.passwordPlaceholder} value={this.state.password} onChange={this.onChange}></input>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary w-100" type="submit">{t.button}</button>
                </div>
                <Link to="/password-reset">
                    <span>{t.forgotPassword}</span>
                </Link>
            </form>
        )
    }
}

export default withRouter(LoginForm);