import React, { Component } from "react";
import lang from "../common/lang";
import { Alert } from "react-bootstrap";

var l = lang();

class Alerts extends Component {
    determineCalendarPhaseAlert(userRoleId, calendarPhase, noResults) {
        if (noResults) return <Alert variant="warning">{l.noResults}</Alert>;

        switch (userRoleId) {
            case 2:
            case 3:
                switch (calendarPhase) {
                    case "reservations":
                        return (
                            <Alert variant={"info"}>
                                {l.alertDisplayingReservationCalendar}
                            </Alert>
                        );
                    case "approval":
                        return (
                            <Alert variant={"info"}>
                                {l.alertCalendarSentToApproval}
                            </Alert>
                        );
                    case "approved":
                        return (
                            <Alert variant={"success"}>
                                {l.alertCalendarConfirmed}
                            </Alert>
                        );
                    case "current":
                        return (
                            <Alert variant={"info"}>
                                {l.alertEditingCurrentCalendar}
                            </Alert>
                        );
                    default:
                        return "";
                }
            case 4:
            case 5:
                switch (calendarPhase) {
                    case "current":
                        return (
                            <Alert variant="info">
                                {l.alertEditingCurrentCalendar}
                            </Alert>
                        );
                    case "past":
                        return (
                            <Alert variant="secondary">
                                {l.alertCannotEditPastCalendar}
                            </Alert>
                        );
                    case "approval":
                        return (
                            <Alert variant="info">
                                {l.alertEditingApprovalCalendar}
                            </Alert>
                        );
                    case "reservations":
                        return (
                            <Alert variant="info">
                                {l.alertDisplayingReservationCalendar}
                            </Alert>
                        );
                    case "approved":
                        return (
                            <Alert variant="success">
                                {l.alertCalendarConfirmed}
                            </Alert>
                        )
                }
            default:
                return "";
        }
    }

    render() {
        var { userRoleId, calendarPhase, response, responseType, noResults } = this.props;

        return (
            <>
                {response !== "" ? (
                    <Alert variant={responseType}>{response}</Alert>
                ) : (
                    ""
                )}
                {this.determineCalendarPhaseAlert(userRoleId, calendarPhase, noResults)}
            </>
        );
    }
}

export default Alerts;
