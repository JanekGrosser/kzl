import React, { Component } from "react";
import axios from "axios";
import authService from "../../services/authService";
import shiftService from "../../services/shiftService";
import statusService from "../../services/statusService";
import { Table, Alert, Form, Button, ButtonToolbar } from "react-bootstrap";
import util from "../../util";
import lang from "../../common/lang";
import Legend from "../Legend";
import calendarService from "../../services/calendarService";
import Buttons from "../Buttons";
import Alerts from "../Alerts";

var l = lang();

class BookingCalendar extends Component {
    constructor(props) {
        super(props);

        this.followingMonths = 6;
        this.state = {
            currentShifts: {},
            months: [],
            selectedMonthId: -1,
            shifts: {},
            statuses: [],
            calendarPhase: "",
            response: "",
            responseType: ""
        };

        this.onMonthSelected = this.onMonthSelected.bind(this);
        this.onDayClicked = this.onDayClicked.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onSendForApproval = this.onSendForApproval.bind(this);
    }

    componentDidMount() {
        //
        axios
            .all([
                axios.get("/data/shifts"),
                axios.get("/data/following-months")
            ])
            .then(
                axios.spread((shiftsResp, followingMonthsResp) => {
                    var months = followingMonthsResp.data;
                    var shifts = shiftsResp.data;

                    this.setState({
                        months,
                        shifts
                    });
                })
            );
    }

    componentWillUnmount() {
        //save current state to localStorage
        console.log("unmount");
    }

    getShifts() {
        return Object.values(this.state.shifts).filter(
            shift => shift.role_id === authService.getUserRoleId()
        );
    }

    getDays() {
        var currentMonth = this.state.months.find(
            el => el.month_id === this.state.selectedMonthId
        );

        if (currentMonth) {
            var currentMonthInteger =
                parseInt(currentMonth.year_month.split("-")[1]) - 1;
            var currentYearInteger = parseInt(
                currentMonth.year_month.split("-")[0]
            );
            var t = new Date(currentYearInteger, currentMonthInteger, 1);
            var days = [];
            while (t.getMonth() == currentMonthInteger) {
                days.push({
                    day_number: t.getDate()
                });
                t = new Date(
                    currentYearInteger,
                    currentMonthInteger,
                    t.getDate() + 1
                );
            }
            return days;
        }
        return [];
    }

    clearAlert() {
        this.setState({
            response: "",
            responseType: ""
        });
    }

    onDayClicked(shiftId, dayNumber) {
        var { calendarPhase } = this.state;
        var userRoleId = authService.getUserRoleId();
        if (calendarService.isEditable(calendarPhase, userRoleId)) {
            var currentShifts = JSON.parse(
                JSON.stringify(this.state.currentShifts)
            );
            if (currentShifts[shiftId] && currentShifts[shiftId][dayNumber]) {
                var statusId = currentShifts[shiftId][dayNumber].status_id;
                if (statusId === 1) {
                    delete currentShifts[shiftId][dayNumber];
                }
            } else {
                currentShifts[shiftId] = Object.assign(currentShifts[shiftId], {
                    [dayNumber]: {
                        status_id: 1
                    }
                });
            }
            this.setState({
                currentShifts
            });
        }
    }

    onSave() {
        var userId = authService.getLoggedInUserId();
        var { currentShifts, selectedMonthId } = this.state;

        calendarService
            .saveMonthlyCalendar(currentShifts, userId, selectedMonthId)
            .then(() => {
                this.setState({
                    response: l.alertCalendarSaved,
                    responseType: "success"
                });
            })
            .catch(err => {
                this.setState({
                    response: l.serverError,
                    responseType: "danger"
                });
            });
    }

    onSendForApproval() {
        var { shifts, currentShifts, selectedMonthId } = this.state;
        var userId = authService.getLoggedInUserId();

        calendarService
            .sendMonthlyCalendarForApproval(
                currentShifts,
                userId,
                selectedMonthId,
                shifts
            )
            .then(currentShifts => {
                this.setState({
                    currentShifts,
                    calendarPhase: "approval"
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    response: l.serverError,
                    responseType: "danger"
                });
            });
    }

    onMonthSelected(e) {
        var selectedMonthId = parseInt(e.target.value);
        var userId = authService.getLoggedInUserId();
        var userSubdivisionId = authService.getUserSubdivisions()[0];
        var { shifts } = this.state;
        this.clearAlert();

        calendarService
            .fetchUserCalendarWithPhase(
                selectedMonthId,
                userId,
                shifts,
                userSubdivisionId
            )
            .then(result => {
                var calendar = result[0];
                var calendarPhase = result[1];
                this.setState({
                    currentShifts: calendar,
                    calendarPhase,
                    selectedMonthId
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        var userRoleId = authService.getUserRoleId();
        var userName = authService.getUsername();
        var userCsr = authService.getUserCSR();

        var { selectedMonthId, currentShifts, calendarPhase } = this.state;

        return (
            <>
                <h2>{l.bookingCalendar}</h2>
                <h4>
                    {userName} - ({userCsr})
                </h4>
                <div className="selectors">
                    <Form.Group>
                        <Form.Label>{l.month}</Form.Label>
                        <Form.Control
                            as="select"
                            name="selected_month"
                            onChange={this.onMonthSelected}
                            value={selectedMonthId}
                        >
                            <option disabled key={0} value={-1}>
                                {l.month}
                            </option>
                            {this.state.months.map((month, el) => (
                                <option key={el + 1} value={month.month_id}>
                                    {month.year_month}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>
                <Buttons
                            roleId={authService.getUserRoleId()}
                            calendarPhase={this.state.calendarPhase}
                            onSave={this.onSave}
                            onApproval={this.onSendForApproval}
                        />
                <Alerts
                    response={this.state.response}
                    responseType={this.state.responseType}
                    userRoleId={userRoleId}
                    calendarPhase={calendarPhase}
                    noResults={!(this.state.selectedMonthId !== -1)}
                />
                {this.state.selectedMonthId !== -1 ? (
                    <>
                        <Table
                            className={"booking " + calendarPhase}
                            bordered
                            responsive
                        >
                            <thead className={"thead-dark"}>
                                <tr>
                                    <th key={0} className="cross-section">
                                        Czas/Dzień
                                    </th>
                                    {this.getDays().map((d, el) => {
                                        return (
                                            <th key={el + 1}>{d.day_number}</th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {this.getShifts().map(shift => {
                                    return (
                                        <tr key={shift.shift_id}>
                                            <td key={0}>
                                                {util.convertMinsToHrsMins(
                                                    shift.shift_start
                                                )}
                                            </td>
                                            {this.getDays().map(day => (
                                                <td
                                                    key={
                                                        shift.shift_id +
                                                        "-" +
                                                        day.day_number
                                                    }
                                                    className={statusService.getClassForStatusId(
                                                        statusService.getStatusIdFromCurrentShifts(
                                                            shift.shift_id,
                                                            day.day_number,
                                                            currentShifts
                                                        )
                                                    )}
                                                    onClick={() =>
                                                        this.onDayClicked(
                                                            shift.shift_id,
                                                            day.day_number
                                                        )
                                                    }
                                                >
                                                    {calendarService.inApproval(this.state.calendarPhase) ? (
                                                        <i className="default fas fa-paper-plane"></i>
                                                    ) : (
                                                        <i className="default fas fa-check"></i>
                                                    )}
                                                    <i className="hover fas fa-times"></i>
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                        <Legend
                            ids={statusService.getStatusIdsForPhase(
                                calendarPhase,
                                userRoleId
                            )}
                        ></Legend>
                    </>
                ) : (
                    ""
                )}
            </>
        );
    }
}

export default BookingCalendar;
