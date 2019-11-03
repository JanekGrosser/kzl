import React, { Component } from "react";
import axios from "axios";
import shiftService from "../../services/shiftService";
import statusService from "../../services/statusService";
import calendarService from "../../services/calendarService";
import { Table, Form, Alert, Button, ButtonToolbar } from "react-bootstrap";
import util from "../../util";
import lang from "../../common/lang";
import DatePicker from "react-datepicker";
import UserHeader from "../common/UserHeader";

import "react-datepicker/dist/react-datepicker.css";
import Legend from "../Legend";
import authService from "../../services/authService";

var l = lang();

class SummaryCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shifts: {},
            dayCalendarShifts: {},
            months: [],
            roles: [],
            users: [],
            subdivisions: [],
            minDate: new Date(),
            maxDate: new Date(),
            selectedDate: new Date(),
            selectedRoleId: -1,
            selectedSubdivisionId: -1,
            calendarSummary: {},
            currentMonthPhase: "current",
            alert: "",
            alertMessage: ""
        };
        this.onDatePicked = this.onDatePicked.bind(this);
        this.onRoleSelected = this.onRoleSelected.bind(this);
        this.onSubdivisionSelected = this.onSubdivisionSelected.bind(this);
        this.onCellClicked = this.onCellClicked.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onReset = this.onReset.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    clearAlert() {
        this.setState({
            alert: "",
            alertMessage: ""
        });
    }

    componentDidMount() {
        axios
            .all([
                axios.get("/data/roles"),
                axios.get("/data/subdivisions"),
                axios.get("/data/status"),
                axios.get("/data/shifts"),
                axios.get("/data/months"),
                axios.get("/data/current-month")
            ])
            .then(
                axios.spread(
                    (
                        rolesResp,
                        subdivisionsResp,
                        statusResp,
                        shiftsResp,
                        monthsResp,
                        currentMonthResp
                    ) => {
                        var parsedMonths = monthsResp.data.map(
                            ({ month_id, year_month }) => {
                                return {
                                    month_id,
                                    date: util.getDateFromYearMonth(year_month),
                                    year_month
                                };
                            }
                        );
                        this.fetchMonthPhase(currentMonthResp.data.month_id);
                        this.setState({
                            subdivisions: subdivisionsResp.data,
                            roles: rolesResp.data.filter(
                                role => role.role_id === 2 || role.role_id === 3
                            ),
                            statuses: statusResp.data,
                            shifts: shiftsResp.data,
                            months: parsedMonths,
                            minDate: parsedMonths[0].date,
                            maxDate: parsedMonths[parsedMonths.length - 1].date,
                            selectedMonthId: currentMonthResp.data.month_id
                        });
                    }
                )
            );
    }

    componentWillUnmount() {
        //save current state to localStorage
        console.log("unmount");
    }

    fetchMonthPhase(monthId) {
        axios
            .get("/data/months-phase", {
                params: {
                    month_id: monthId
                }
            })
            .then(resp => {
                console.log(resp.data);
                this.setState({
                    currentMonthPhase: resp.data.phase
                });
            });
    }

    fetchUsers(roleId, subdivisionId) {
        if (this.isDataSelectedForUserQuery(roleId, subdivisionId)) {
            axios
                .get(`/users/list/${subdivisionId}`, {
                    params: {
                        role_id: roleId
                    }
                })
                .then(resp => {
                    this.setState({
                        users: resp.data
                    });
                });
        }
    }

    fetchDayCalendar(monthId, roleId, subdivisionId, dayNumber) {
        console.log("asdaaaa", monthId, roleId, subdivisionId, dayNumber);
        if (this.isDataSelected(monthId, roleId, subdivisionId, dayNumber)) {
            console.log("asd");
            calendarService
                .fetchDailyCalendar(monthId, roleId, subdivisionId, dayNumber)
                .then(dayShifts => {
                    var dayCalendar = calendarService.convertDailyCalendarShiftsToDailyCalendarObject(
                        dayShifts
                    );
                    this.setState({
                        dayCalendarShifts: dayCalendar,
                        calendarSummary: shiftService.getDayCalendarSummary(
                            dayCalendar,
                            this.getShifts(roleId)
                        )
                    });
                });
        }
    }

    onDatePicked(selectedDate) {
        var month = util.getMonthObjectFromDate(
            selectedDate,
            this.state.months
        );
        this.fetchDayCalendar(
            month.month_id,
            this.state.selectedRoleId,
            this.state.selectedSubdivisionId,
            selectedDate.getDate()
        );
        this.fetchMonthPhase(month.month_id);
        this.setState({
            selectedDate,
            selectedMonthId: month.month_id
        });
    }

    onRoleSelected(e) {
        var roleId = e.target.value;
        var month = util.getMonthObjectFromDate(
            this.state.selectedDate,
            this.state.months
        );
        this.fetchUsers(roleId, this.state.selectedSubdivisionId);
        this.fetchDayCalendar(
            month.month_id,
            roleId,
            this.state.selectedSubdivisionId,
            this.state.selectedDate.getDate()
        );
        this.setState({
            selectedRoleId: roleId
        });
    }

    onSubdivisionSelected(e) {
        var subdivisionId = e.target.value;
        var month = util.getMonthObjectFromDate(
            this.state.selectedDate,
            this.state.months
        );
        this.fetchUsers(this.state.selectedRoleId, subdivisionId);
        this.fetchDayCalendar(
            month.month_id,
            this.state.selectedRoleId,
            subdivisionId,
            this.state.selectedDate.getDate()
        );
        this.setState({
            selectedSubdivisionId: subdivisionId
        });
    }

    onCellClicked(userId, shiftId) {
        if (this.isEditable()) {
            var dayCalendarShifts = JSON.parse(
                JSON.stringify(this.state.dayCalendarShifts)
            );
            if (dayCalendarShifts[userId] !== undefined) {
                var status = dayCalendarShifts[userId][shiftId];
                var newStatus = statusService.shiftStatusId(
                    this.state.currentMonthPhase,
                    status
                );
                if (newStatus) {
                    dayCalendarShifts[userId][shiftId] = newStatus;
                } else {
                    delete dayCalendarShifts[userId][shiftId];
                }
            } else {
                var newStatus = statusService.shiftStatusId(
                    this.state.currentMonthPhase
                );
                dayCalendarShifts[userId] = {};
                dayCalendarShifts[userId][shiftId] = newStatus;
            }

            var calendarSummary = shiftService.getDayCalendarSummary(
                dayCalendarShifts,
                this.getShifts
            );

            this.setState({
                dayCalendarShifts,
                calendarSummary
            });
        }
    }

    onReset() {
        //TODO
    }

    onSave() {
        var {
            dayCalendarShifts,
            selectedMonthId,
            selectedRoleId,
            selectedDate
        } = this.state;
        calendarService.saveDailyCalendar(
            dayCalendarShifts,
            selectedMonthId,
            selectedRoleId,
            selectedDate.getDate()
        );
    }

    onConfirm() {}

    isDataSelectedForUserQuery(roleId, subdivisionId) {
        return (
            roleId !== undefined &&
            roleId !== -1 &&
            subdivisionId !== undefined &&
            subdivisionId !== -1
        );
    }

    isDataSelected(monthId, roleId, subdivisionId, dayNumber) {
        return (
            monthId !== undefined &&
            monthId !== -1 &&
            this.isDataSelectedForUserQuery(roleId, subdivisionId) &&
            dayNumber !== undefined &&
            dayNumber !== -1
        );
    }

    areResultsEmpty() {
        return this.state.users.length === 0;
    }

    isEditable() {
        return calendarService.isEditable(
            this.state.currentMonthPhase,
            authService.getUserRoleId()
        );
    }

    /**
     * Returns an alert if required. Alert from state (alert variatn and message)
     * takes precedence
     */
    getAlertIfNeeded() {
        if (this.state.alert !== "") {
            return (
                <Alert variant={this.state.alert}>
                    {this.state.alertMessage}
                </Alert>
            );
        }

        if (this.areResultsEmpty()) {
            return <Alert variant="warning">{l.noResults}</Alert>;
        }

        switch (this.state.currentMonthPhase) {
            case "current":
                return (
                    <Alert variant="info">Edytujesz biezacy kalendarz</Alert>
                );
            case "past":
                return (
                    <Alert variant="warning">
                        Nie mozna edytowac kalendarza z przeszlosci
                    </Alert>
                );
            case "reservations":
                return (
                    <Alert variant="info">
                        Przeglądasz kalendarz rezerwacji
                    </Alert>
                );
        }
    }

    getUsers() {
        return this.state.users;
    }

    getCalendarSummary() {
        return this.state.calendarSummary;
    }

    getShifts(roleId) {
        var role = roleId ? roleId : this.state.selectedRoleId;
        var ojb = Object.values(this.state.shifts).filter(
            s => s.role_id == role
        );
        console.log(ojb);
        return ojb;
    }

    render() {
        return (
            <>
                <UserHeader />
                <div className="selectors">
                    <Form.Group>
                        <Form.Label>Rodzaj technika</Form.Label>
                        <Form.Control
                            as="select"
                            name="selected_role"
                            onChange={this.onRoleSelected}
                            value={this.state.selectedRoleId}
                        >
                            <option disabled key={0} value={-1}>
                                Wybierz rolę
                            </option>
                            {this.state.roles.map(role => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.role}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Podwykonawca</Form.Label>
                        <Form.Control
                            as="select"
                            name="selected_subdivision"
                            onChange={this.onSubdivisionSelected}
                            value={this.state.selectedSubdivisionId}
                        >
                            <option disabled key={0} value={-1}>
                                Wybierz podykonawcę
                            </option>

                            {this.state.subdivisions.map(subdivision => (
                                <option
                                    key={subdivision.subdivision_id}
                                    value={subdivision.subdivision_id}
                                >
                                    {subdivision.subdivision_name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Data</Form.Label>
                        <DatePicker
                            className="form-control"
                            selected={this.state.selectedDate}
                            onChange={this.onDatePicked}
                            minDate={this.state.minDate}
                            maxDate={this.state.maxDate}
                        />
                    </Form.Group>
                    <Form.Group>
                        {this.state.selectedMonthId !== -1 &&
                        this.isEditable() ? (
                            <ButtonToolbar>
                                <Button variant="primary" onClick={this.onSave}>
                                    <i className="fas fa-save"></i>Zapisz
                                </Button>
                                <Button
                                    variant="warning"
                                    onClick={this.onReset}
                                >
                                    <i className="fas fa-sync"></i>Przywróć
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={this.onConfirm}
                                >
                                    <i className="fas fa-sync"></i>Zatwierdź
                                </Button>
                            </ButtonToolbar>
                        ) : (
                            ""
                        )}
                    </Form.Group>
                </div>
                {this.getAlertIfNeeded()}
                <>
                    <Table
                        className={
                            "summary-daily " + this.state.currentMonthPhase
                        }
                        bordered
                        responsive
                    >
                        <thead className={"thead-dark"}>
                            <tr>
                                <th className="cross-section" key="0">
                                    Technik/Zmiana
                                </th>
                                {this.getShifts().map(shift => {
                                    return (
                                        <th
                                            key={
                                                "shift-header-" + shift.shift_id
                                            }
                                        >
                                            {util.convertMinsToHrsMins(
                                                shift.shift_start
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.getUsers().map(
                                ({
                                    user_id,
                                    first_name,
                                    last_name,
                                    username_csr
                                }) => {
                                    var shifts =
                                        this.state.dayCalendarShifts[user_id] ||
                                        {};
                                    return (
                                        <tr key={"user-entry-" + user_id}>
                                            <td key="0">
                                                {first_name} {last_name}(
                                                {username_csr})
                                            </td>
                                            {this.getShifts().map(
                                                ({ shift_id }) => {
                                                    return (
                                                        <td
                                                            className={statusService.getClassForStatusId(
                                                                shifts[shift_id]
                                                            )}
                                                            onClick={() =>
                                                                this.onCellClicked(
                                                                    user_id,
                                                                    shift_id
                                                                )
                                                            }
                                                            key={
                                                                "shift-" +
                                                                shift_id
                                                            }
                                                        ></td>
                                                    );
                                                }
                                            )}
                                        </tr>
                                    );
                                }
                            )}
                            <tr>
                                <td style={{ border: "none" }} key="0"></td>
                                {Object.keys(this.getCalendarSummary()).map(
                                    shiftId => {
                                        return (
                                            <td
                                                key={"shift-summary-" + shiftId}
                                            >
                                                {
                                                    this.state.calendarSummary[
                                                        shiftId
                                                    ]
                                                }
                                            </td>
                                        );
                                    }
                                )}
                            </tr>
                        </tbody>
                    </Table>
                    <Legend
                        ids={statusService.getStatusIdsForPhase(
                            this.state.currentMonthPhase
                        )}
                    ></Legend>
                </>
            </>
        );
    }
}

export default SummaryCalendar;
