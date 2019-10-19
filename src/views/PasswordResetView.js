import React, { Component } from 'react';
import lang from "../common/lang";
import PasswordResetForm from "../components/PasswordResetForm";

var t = lang().passwordReset;

class PasswordResetView extends Component {
    render() {
        return (
            <div className="password-reset-view container">
                <div>
                    <header>
                        <i class="fas fa-unlock"></i>
                        <span>{t.header}</span>
                    </header>
                    <PasswordResetForm/>
                </div>
            </div>
        );
    }
}

export default PasswordResetView;