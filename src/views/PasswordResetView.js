import React, { Component } from 'react';
import lang from "../common/lang";
import PasswordResetForm from "../components/PasswordResetForm";

var t = lang().passwordReset;

class PasswordResetView extends Component {
    render() {
        return (
            <main className="password-reset-view container">
                <div>
                    <header>
                        <i class="fas fa-unlock"></i>
                        <span>{t.header}</span>
                    </header>
                    <PasswordResetForm/>
                </div>
            </main>
        );
    }
}

export default PasswordResetView;