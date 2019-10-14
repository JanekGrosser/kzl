import React, { Component } from 'react';
import lang from '../common/lang';
import authService from "../services/authService";
import { withRouter } from "react-router-dom";

var c = lang().common;
var t = lang().passwordReset;

class PasswordResetForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            csr: "",
            error: "",
            message: ""
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(evt) {
        evt.preventDefault();
        authService.resetPassword(this.state.csr)
            .then(() => {
                this.setState({
                    message: t.success,
                    error: ""
                })
            })
            .catch((err) => {
                var error;
                switch(err.response.status) {
                    case 404: 
                        error = t.wrongCsr;
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
                {this.state.message ? <div className="alert alert-success" role="alert">{this.state.message}</div> : ""}
                {this.state.error ? <div className="alert alert-danger" role="alert">{this.state.error}</div> : ""}
                <div className="form-group">
                    <input type="text" className="form-control" name="csr" id="csr" placeholder={c.csrPlaceholder} value={this.state.csr} onChange={this.onChange}></input>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary w-100" type="submit">{t.button}</button>
                </div>
                <a href="#" onClick={this.props.history.goBack}>
                    <i class="fas fa-arrow-left"></i>
                    <span>{c.back}</span>
                </a>
            </form>
        )
    }
}

export default withRouter(PasswordResetForm);