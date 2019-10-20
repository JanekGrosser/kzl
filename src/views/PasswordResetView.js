import React, { Component } from 'react';
import l from "../common/lang";
import PasswordResetForm from "../components/PasswordResetForm";

var lang = l();

class PasswordResetView extends Component {
    render() {
        return (
            <main className="password-reset-view container">
                <div>
                    <header>
                        <i className="fas fa-unlock"></i>
                        <span>{lang.resetPassword}</span>
                    </header>
                    <PasswordResetForm/>
                </div>
            </main>
        );
    }
}

export default PasswordResetView;