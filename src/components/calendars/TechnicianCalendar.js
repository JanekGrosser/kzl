import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import authService from "../../services/authService";
import shiftService from "../../services/shiftService";
import userService from "../../services/userService";
import statusService from "../../services/statusService";
import calendarService from "../../services/calendarService";
import { Table, Form, Alert, Button, ButtonToolbar } from "react-bootstrap";
import Legend from "../Legend";
import Buttons from "../Buttons";
import util from "../../util";
import lang from "../../common/lang";

var l = lang();

class TechnicianCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: [],
            calendar: {},
            shifts: {},
            statuses: [],
            selectedRoleId: -1,
            selectedSubdivisionId: -1,
            selectedUserId: -1,
            selectedMonthId: -1,
            currentMonth: "2019-10",
            currentMonthPhase: "current",
            users: [],
            roles: [],
            subdivisions: [],
            months: [],
            approved: false
        };

        this.onUserSelected = this.onUserSelected.bind(this);
        this.onSubdivisionSelected = this.onSubdivisionSelected.bind(this);
        this.onRoleSelected = this.onRoleSelected.bind(this);
        this.onMonthSelected = this.onMonthSelected.bind(this);
        this.onDayClick = this.onDayClick.bind(this);
        this.onCellClicked = this.onCellClicked.bind(this);
        this.saveCache = this.saveCache.bind(this);

        this.onChangeCurrent = this.onChangeCurrent.bind(this);
        this.onSaveApproval = this.onSaveApproval.bind(this);
        this.onConfirmApproval = this.onConfirmApproval.bind(this);
        this.onReset = this.onReset.bind(this);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.saveCache);
        var savedState = sessionStorage.getItem("technicianCalendar");
        var params = this.props.match.params;
        if (savedState != null) {
            savedState = JSON.parse(savedState);

            if (
                params.monthId === undefined || //if a sample param is empty OR
                (savedState.selectedMonthId == params.monthId &&
                    savedState.selectedRoleId == params.roleId &&
                    savedState.selectedSubdivisionId == params.subdivisionId &&
                    savedState.selectedUserId == params.userId)
            ) {
                // we came back to editing previous user
                console.log("Restoring state");
                this.setState(savedState);
                return;
            }
            sessionStorage.removeItem("technicianCalendar");
        }

        var roleId = params.roleId;
        var monthId = params.monthId;
        var userId = params.userId;
        var subdivisionId = params.subdivisionId;

        axios
            .all([
                axios.get("/data/roles"),
                axios.get("/data/subdivisions"),
                axios.get("/data/status"),
                axios.get("/data/shifts"),
                axios.get("/data/current-month"),
                axios.get("/data/following-months")
            ])
            .then(
                axios.spread(
                    (
                        rolesResp,
                        subdivisionsResp,
                        statusResp,
                        shiftsResp,
                        currentMonthResp,
                        followingMonthResp
                    ) => {
                        followingMonthResp.data.unshift(currentMonthResp.data);
                        this.setState({
                            statuses: statusResp.data,
                            shifts: shiftsResp.data,
                            months: followingMonthResp.data,
                            roles: rolesResp.data.filter(
                                role => role.role_id == 2 || role.role_id == 3
                            ),
                            subdivisions: subdivisionsResp.data,
                            selectedRoleId: roleId || -1,
                            selectedSubdivisionId: subdivisionId || -1,
                            selectedUserId: userId || -1,
                            selectedMonthId: monthId || -1
                        });
                        this.fetchMonthPhase(monthId);
                        this.fetchCalendar(
                            roleId,
                            subdivisionId,
                            userId,
                            monthId
                        );
                        this.fetchSummary(roleId,subdivisionId,monthId);
                    }
                )
            );
    }

    componentWillUnmount() {}

    saveCache() {
        console.log("saving cache");
        sessionStorage.setItem(
            "technicianCalendar",
            JSON.stringify(this.state)
        );
    }

    componentWillUnmount() {
        this.saveCache();
        window.removeEventListener("beforeunload", this.saveCache); // remove the event handler for normal unmounting
        console.log("unmounting");
    }

    getShifts() {
        return Object.values(this.state.shifts).filter(
            shift => shift.role_id == this.state.selectedRoleId
        );
    }

    getDays() {
        var currentMonth = this.state.months
            .find(m => m.month_id == this.state.selectedMonthId)
            .year_month.split("-");
        var currentMonthInt = parseInt(currentMonth[1]) - 1;
        var t = new Date(parseInt(currentMonth[0]), currentMonthInt, 1);
        var days = [];
        while (t.getMonth() == currentMonthInt) {
            days.push({
                day_number: t.getDate()
            });
            var t1 = t.getTime();
            t = new Date(t1 + 24 * 60 * 60 * 1000);
        }
        return days;
    }

    getAlertIfNeeded() {
        if (!this.shouldDisplayTable()) {
            return (
                <Alert variant="warning">{l.noResults}</Alert>
            )
        }
        switch (this.state.currentMonthPhase) {
            case "current":
                return (
                    <Alert variant="info">
                        {l.alertEditingCurrentCalendar}
                    </Alert>
                );
            case "past":
                return (
                    <Alert variant="warning">
                        {l.alertCannotEditPastCalendar}
                    </Alert>
                );
            case "reservations":
                return (
                    <Alert variant="info">
                        {l.alertDisplayingReservationCalendar}
                    </Alert>
                );
        }
    }

    getSummaryNumber(shiftId, dayNumber) {
        if (this.state.summary[shiftId] && this.state.summary[shiftId][dayNumber])
            return this.state.summary[shiftId][dayNumber];
        return 0;
    }

    fetchSummary(roleId, subdivisionId, monthId) {
        if(this.shouldFetchSummary(roleId, subdivisionId, monthId)) {
            calendarService.fetchMonthSummary(roleId, subdivisionId, monthId)
                .then(summary => {
                    this.setState({
                        summary
                    })
                })
        }
    }

    fetchCalendar(roleId, subdivisionId, userId, monthId) {
        //debugger;
        if (this.shouldFetchCalendar(roleId, subdivisionId, userId, monthId)) {
            calendarService
                .fetchMonthlyCalendar(monthId, userId, this.getShifts())
                .then(calendar => {
                    this.setState({
                        calendar
                    });
                });
        }
    }

    fetchUsers(roleId, subdivisionId) {
        if (this.shouldUpdateUsers(roleId, subdivisionId)) {
            userService.fetchUsers(roleId, subdivisionId).then(users => {
                this.setState({
                    users: users
                });
            });
        }
    }

    fetchMonthPhase(monthId) {
        if (monthId !== undefined) {
            axios
                .get("/data/months-phase", {
                    params: {
                        month_id: monthId
                    }
                })
                .then(resp => {
                    this.setState({
                        currentMonthPhase: resp.data.phase
                    });
                });
        }
    }

    shouldFetchSummary(roleId, subdivisionId, monthId) {
        return roleId !== -1 && subdivisionId !== -1 && monthId !== -1;
    }

    shouldFetchCalendar(roleId, subdivisionId, userId, monthId) {
        return (
            this.shouldUpdateUsers(roleId, subdivisionId) &&
            userId !== -1 &&
            monthId !== -1
        );
    }

    shouldUpdateUsers(roleId, subdivisionId) {
        roleId = roleId === undefined ? this.state.selectedRoleId : roleId;
        subdivisionId =
            subdivisionId === undefined
                ? this.state.selectedSubdivisionId
                : subdivisionId;
        return roleId !== -1 && subdivisionId !== -1;
    }

    shouldDisplayTable() {
        return this.state.selectedUserId !== -1 && Object.keys(this.state.calendar).length > 0;
    }

    isEditable() {
        return calendarService.isEditable(
            this.state.currentMonthPhase,
            authService.getUserRoleId(),            
        ) && !this.approved;
    }

    onSubdivisionSelected(e) {
        this.setState({
            selectedSubdivisionId: parseInt(e.target.value),
            selectedUserId: -1
        });
        this.fetchUsers(this.state.selectedRoleId, e.target.value);
        this.fetchSummary(this.state.selectedRoleId,e.target.value,this.state.selectedMonthId);
    }

    onUserSelected(e) {
        this.setState({
            selectedUserId: parseInt(e.target.value)
        });
        this.fetchCalendar(
            this.state.selectedRoleId,
            this.state.selectedSubdivisionId,
            e.target.value,
            this.state.selectedMonthId
        );
    }

    onRoleSelected(e) {
        this.setState({
            selectedRoleId: parseInt(e.target.value),
            selectedUserId: -1
        });
        this.fetchUsers(e.target.value, this.state.selectedSubdivisionId);
        this.fetchSummary(e.target.value,this.state.selectedSubdivisionId,this.state.selectedMonthId);
    }

    onMonthSelected(e) {
        this.setState({
            selectedMonthId: parseInt(e.target.value)
        });
        this.fetchCalendar(
            this.state.selectedRoleId,
            this.state.selectedSubdivisionId,
            this.state.selectedUserId,
            e.target.value
        );
        this.fetchMonthPhase(parseInt(e.target.value));
        this.fetchSummary(this.state.selectedRoleId,this.state.selectedSubdivisionId,e.target.value);
    }

    onDayClick(dayNumber) {
        ///summary-daily/:roleId?/:subdivisionId?/:dayNumber?/:monthId?/
        var roleId = this.state.selectedRoleId;
        var subdivisionId = this.state.selectedSubdivisionId;
        var monthId = this.state.selectedMonthId;
        this.props.history.push(
            `/summary-daily/${roleId}/${subdivisionId}/${dayNumber}/${monthId}`
        );
    }

    onCellClicked(dayNumber, shiftId) {
        if (this.isEditable()) {
            var calendar = JSON.parse(JSON.stringify(this.state.calendar));
            var currentStatus = statusService.getStatusIdFromCurrentShifts(
                shiftId,
                dayNumber,
                calendar
            );
            var newStatus = statusService.shiftStatusId(
                this.state.currentMonthPhase,
                currentStatus
            );
            if (!calendar[shiftId]) {
                calendar[shiftId] = {};
            }
            calendar[shiftId][dayNumber] = {
                status_id: newStatus
            };
            this.setState({
                calendar
            });
        }
    }

    onChangeCurrent() {
        var calendar = JSON.parse(JSON.stringify(this.state.calendar));
        calendarService.saveMonthlyCalendar(calendar, this.state.selectedUserId, this.state.selectedMonthId)
            .then(cal => {
                this.fetchSummary(this.state.selectedRoleId, this.state.selectedSubdivisionId, this.state.selectedMonthId);
            });
    }

    onSaveApproval() {
        var calendar = JSON.parse(JSON.stringify(this.state.calendar));
        calendarService.saveMonthlyCalendarApproval(calendar, this.state.selectedUserId, this.state.selectedMonthId)
            .then(cal => {
                this.fetchSummary(this.state.selectedRoleId, this.state.selectedSubdivisionId, this.state.selectedMonthId);
            });
    }

    onConfirmApproval() {
        var calendar = JSON.parse(JSON.stringify(this.state.calendar));
        calendarService.confirmMonthlyCalendar(calendar, this.state.selectedUserId, this.state.selectedMonthId, this.state.currentMonthPhase)
            .then(res => {
                var calendar = shiftService.parseShiftsResp(res[1], this.getShifts());
                this.setState({
                    calendar
                })
                this.fetchSummary(this.state.selectedRoleId, this.state.selectedSubdivisionId, this.state.selectedMonthId);
            });
    }

    onReset() {
        //TODO
    }

    render() {
        return (
            <>
                <h2>{l.technicianCalendar}</h2>
                <div className="selectors">
                    <Form.Group>
                        <Form.Label>{l.technicianRole}</Form.Label>
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
                        <Form.Label>{l.subdivision}</Form.Label>
                        <Form.Control
                            as="select"
                            name="selected_subdivision"
                            onChange={this.onSubdivisionSelected}
                            value={this.state.selectedSubdivisionId}
                        >
                            <option disabled key={0} value={-1}>
                                Wybierz podwykonawcę
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
                        <Form.Label>{l.technician}</Form.Label>
                        <Form.Control
                            as="select"
                            name="selected_technician"
                            onChange={this.onUserSelected}
                            value={this.state.selectedUserId}
                            ref={ref => (this.select = ref)}
                            disabled={!this.shouldUpdateUsers()}
                        >
                            <option disabled key={0} value={-1}>
                                Wybierz technika
                            </option>

                            {this.state.users.map(user => (
                                <option key={user.user_id} value={user.user_id}>
                                    {user.first_name} {user.last_name} (
                                    {user.username_csr})
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Miesiąc</Form.Label>
                        <Form.Control
                            as="select"
                            name="selected_month"
                            onChange={this.onMonthSelected}
                            value={this.state.selectedMonthId}
                        >
                            <option disabled key={0} value={-1}>
                                Wybierz miesiąc
                            </option>

                            {this.state.months.map(month => (
                                <option
                                    key={month.month_id}
                                    value={month.month_id}
                                >
                                    {month.year_month}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>
                <Buttons
                    roleId={authService.getUserRoleId()}
                    monthPhase={this.state.currentMonthPhase}
                    onSaveApproval={this.onSaveApproval}
                    onConfirmApproval={this.onConfirmApproval}
                    onChangeCurrent={this.onChangeCurrent}
                    onReset={this.onReset}
                />
                {this.getAlertIfNeeded()}
                {this.shouldDisplayTable() ? (
                    <Table
                        className={"technician " + this.state.currentMonthPhase}
                        bordered
                        responsive
                    >
                        <thead className={"thead-dark"}>
                            <tr>
                                <th className="cross-section">Czas/Dzień</th>
                                {this.getDays().map(d => {
                                    return (
                                        <th
                                            key={d.day_number}
                                            onClick={() => {
                                                this.onDayClick(d.day_number);
                                            }}
                                        >
                                            {d.day_number}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {this.getShifts().map(shift => {
                                return (
                                    <tr key={shift.shift_id}>
                                        <td>
                                            {util.convertMinsToHrsMins(
                                                shift.shift_start
                                            )}
                                        </td>
                                        {this.getDays().map(day => (
                                            <td
                                                key={day.day_number}
                                                className={statusService.getClassForStatusId(
                                                    statusService.getStatusIdFromCurrentShifts(
                                                        shift.shift_id,
                                                        day.day_number,
                                                        this.state.calendar
                                                    )
                                                )}
                                                onClick={() => {
                                                    this.onCellClicked(
                                                        day.day_number,
                                                        shift.shift_id
                                                    );
                                                }}
                                            ><span className="summary">{this.getSummaryNumber(shift.shift_id,day.day_number)}</span></td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                ) : "" }
                <Legend
                    ids={statusService.getStatusIdsForPhase(
                        this.state.currentMonthPhase
                    )}
                ></Legend>
            </>
        );
    }
}

export default withRouter(TechnicianCalendar);
