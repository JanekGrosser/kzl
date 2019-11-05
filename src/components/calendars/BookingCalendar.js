import React, { Component } from "react";
import axios from "axios";
import authService from "../../services/authService";
import shiftService from "../../services/shiftService";
import statusService from "../../services/statusService";
import { Table, Alert, Form, Button, ButtonToolbar } from "react-bootstrap";
import util from "../../util";
import lang from "../../common/lang";
import Legend from "../Legend";

var l = lang();

/**
 * ID Helper
 *
 * 1 - editable - on save/local storage,
 * on send - 2 - approval
 */

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
            calendarInApproval: false
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

    onDayClicked(shiftId, dayNumber) {
        if (!this.state.calendarInApproval) {
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
        var requestObject = shiftService.toShiftRequestFormat(
            this.state.currentShifts,
            this.state.selectedMonthId,
            authService.getLoggedInUserId()
        );
        axios
            .post(
                `/data/users-calendars/${authService.getLoggedInUserId()}`,
                requestObject
            )
            .then(res => {
                console.log(res);
            });
    }

    onSendForApproval() {
        var requestObject = shiftService.toShiftRequestFormat(
            this.state.currentShifts,
            this.state.selectedMonthId,
            authService.getLoggedInUserId()
        );

        var approvalShifts = requestObject.shifts.map(shift => {
            shift.status_id = 2;
            return shift;
        });

        requestObject.shifts = approvalShifts;

        axios
            .post(
                `/data/users-calendars/${authService.getLoggedInUserId()}`,
                requestObject
            )
            .then(res => {
                this.setState({
                    currentShifts: shiftService.parseShiftsResp(
                        this.state.shifts,
                        approvalShifts,
                        authService.getLoggedInUserId()
                    ),
                    calendarInApproval: true
                });
            });
    }

    onMonthSelected(e) {
        var selectedMonthId = parseInt(e.target.value);

        axios
            .get(`/data/users-calendars/${authService.getLoggedInUserId()}`, {
                params: {
                    month_id: selectedMonthId
                }
            })
            .then(res => {
                var calendarInApproval = false;
                var found = res.data.shifts.find(s => s.status_id === 2);
                if (found) calendarInApproval = true;
                var currentShifts = shiftService.parseShiftsResp(
                    this.state.shifts,
                    res.data.shifts,
                    authService.getLoggedInUserId()
                );

                this.setState({
                    currentShifts,
                    selectedMonthId,
                    calendarInApproval
                });
            });
    }

    render() {
        return (
            <>
                <h2>{l.bookingCalendar}</h2>
                <h4>
                    {authService.getUsername()} - ({authService.getUserCSR()})
                </h4>
                <div className="selectors">
                    <Form.Group>
                        <Form.Label>{l.month}</Form.Label>
                        <Form.Control
                            as="select"
                            name="selected_month"
                            onChange={this.onMonthSelected}
                            value={this.state.selectedMonthId}
                        >
                            <option disabled key={0} value={-1}>
                                Wybierz miesiąc
                            </option>
                            {this.state.months.map((month, el) => (
                                <option key={el + 1} value={month.month_id}>
                                    {month.year_month}
                                </option>
                            ))}
                        </Form.Control>
                        {this.state.selectedMonthId !== -1 &&
                        !this.state.calendarInApproval ? (
                            <ButtonToolbar>
                                <Button variant="primary" onClick={this.onSave}>
                                    <i className="fas fa-save"></i>Zapisz
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={this.onSendForApproval}
                                >
                                    <i
                                        className="fa fa-paper-plane"
                                        aria-hidden="true"
                                    ></i>
                                    Wyślij do zatwierdzenia
                                </Button>
                            </ButtonToolbar>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                </div>
                <Alert show={this.state.calendarInApproval} variant={"info"}>
                    Wybrany kalendarz został wysłany do zatwierdzenia!
                </Alert>
                {this.state.selectedMonthId !== -1 ? (
                    <>
                        <Legend ids={statusService.getStatusIdsForPhase("reservations", authService.getUserRoleId())}></Legend>
                        <Table
                            className={
                                "booking " +
                                (this.state.calendarInApproval
                                    ? "approval"
                                    : "editable")
                            }
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
                                                            this.state
                                                                .currentShifts
                                                        )
                                                    )}
                                                    onClick={() =>
                                                        this.onDayClicked(
                                                            shift.shift_id,
                                                            day.day_number
                                                        )
                                                    }
                                                >
                                                    {this.state
                                                        .calendarInApproval ? (
                                                        <i className="default fas fa-ban"></i>
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
                    </>
                ) : (
                    ""
                )}
            </>
        );
    }
}

export default BookingCalendar;
