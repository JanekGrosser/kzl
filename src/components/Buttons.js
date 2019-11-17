import React, { Component } from "react";
import { Button, ButtonToolbar } from "react-bootstrap";
import lang from "../common/lang";

var l = lang();
/**
 * Renders toolbar and actions depending on role and calendar phase
 */
class Buttons extends Component {
    determineButtons(roleId, calendarPhase) {
        switch (calendarPhase) {
            case "reservations":
                switch (roleId) {
                    case 3:
                    case 2:
                        return (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={this.props.onSave}
                                >
                                    <i className="fas fa-save"></i>
                                    {l.save}
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={this.props.onApproval}
                                >
                                    <i
                                        className="fa fa-paper-plane"
                                        aria-hidden="true"
                                    ></i>
                                    {l.sendToApproval}
                                </Button>
                            </>
                        );
                    default:
                        return "";
                }
            case "approval":
                switch (roleId) {
                    case 5:
                        return (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={this.props.onSaveApproval}
                                >
                                    <i className="fas fa-save"></i>
                                    {l.save}
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={this.props.onConfirmApproval}
                                >
                                    <i className="fas fa-sync"></i>
                                    {l.confirm}
                                </Button>
                            </>
                        );
                    default:
                        return "";
                }
            case "current":
                switch (roleId) {
                    case 5:
                        return (
                            <>
                                <Button
                                    variant="outline-danger"
                                    onClick={this.props.onChangeCurrent}
                                >
                                    <i className="fas fa-save"></i>
                                    {l.change}
                                </Button>
                            </>
                        );
                    default:
                        return "";
                }

            case "approved":
            case "past":
            default:
                return "";
        }
    }

    render() {
        var roleId = this.props.roleId;
        var calendarPhase = this.props.calendarPhase;
        var displayReset = this.props.displayReset;

        return (
            <ButtonToolbar>
                {this.determineButtons(roleId, calendarPhase)}
                {displayReset ? (
                    <Button variant="warning" onClick={this.props.onReset}>
                        <i className="fas fa-sync"></i>
                        {l.reset}
                    </Button>
                ) : (
                    ""
                )}
            </ButtonToolbar>
        );
    }
}

export default Buttons;
