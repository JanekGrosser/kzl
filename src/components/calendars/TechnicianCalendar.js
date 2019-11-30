import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import authService from "../../services/authService";
import shiftService from "../../services/shiftService";
import userService from "../../services/userService";
import statusService from "../../services/statusService";
import calendarService from "../../services/calendarService";
import { Table, Form } from "react-bootstrap";
import Legend from "../Legend";
import Buttons from "../Buttons";
import Alerts from "../Alerts";
import util from "../../util";
import lang from "../../common/lang";

var l = lang();

class TechnicianCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summary: [],
            calendar: {},
            calendarPhase: "",
            shifts: {},
            statuses: [],
            selectedRoleId: -1,
            selectedSubdivisionId: -1,
            selectedUserId: -1,
            selectedMonthId: -1,
            currentMonth: "2019-10",
            users: [],
            roles: [],
            subdivisions: [],
            months: [],
            response: "",
            responseType: ""
        };

        this.onUserSelected = this.onUserSelected.bind(this);
        this.onSubdivisionSelected = this.onSubdivisionSelected.bind(this);
        this.onRoleSelected = this.onRoleSelected.bind(this);
        this.onMonthSelected = this.onMonthSelected.bind(this);
        this.onDayClick = this.onDayClick.bind(this);
        this.onCellClicked = this.onCellClicked.bind(this);
        this.onChangeCurrent = this.onChangeCurrent.bind(this);
        this.onChangeApproved = this.onChangeApproved.bind(this);
        this.onSaveApproval = this.onSaveApproval.bind(this);
        this.onConfirmApproval = this.onConfirmApproval.bind(this);

        // selecting technicians
        this.onArrowLeft = this.onArrowLeft.bind(this);
        this.onArrowRight = this.onArrowRight.bind(this);
    }

    componentDidMount() {
        this.onKeyDownEventListener = window.addEventListener(
            "keydown",
            e => {
                e = e || window.event;
                console.log(e.keyCode);

                if (e.keyCode === 37) {
                    this.onArrowLeft();
                } else if (e.keyCode === 39) {
                    this.onArrowRight();
                }
            }
        );

        var params = this.props.match.params;

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
                        var selectedSubdivisionId = subdivisionId || -1;
                        var selectedUserId = userId || -1;
                        var selectedMonthId = monthId || -1;
                        var selectedRoleId = roleId || -1;
                        followingMonthResp.data.unshift(currentMonthResp.data);
                        this.setState({
                            statuses: statusResp.data,
                            shifts: shiftsResp.data,
                            months: followingMonthResp.data,
                            roles: rolesResp.data.filter(
                                role => role.role_id == 2 || role.role_id == 3
                            ),
                            subdivisions: subdivisionsResp.data,
                            selectedRoleId,
                            selectedSubdivisionId,
                            selectedUserId,
                            selectedMonthId
                        });
                        this.fetchUsers(
                            selectedRoleId,
                            selectedSubdivisionId,
                            selectedMonthId
                        );
                        this.fetchCalendar(
                            selectedRoleId,
                            selectedSubdivisionId,
                            selectedUserId,
                            selectedMonthId
                        );
                        this.fetchSummary(
                            selectedRoleId,
                            selectedSubdivisionId,
                            selectedMonthId
                        );
                        this.fetchCalendarPhase(
                            selectedUserId,
                            selectedSubdivisionId,
                            selectedMonthId
                        );
                    }
                )
            );
    }

    componentWillUnmount() {
        window.removeEventListener("onkeydown", this.onKeyDownEventListener);
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
            var dayOfWeek = t.getDay();
            days.push({
                day_number: t.getDate(),
                day_of_week: dayOfWeek,
                weekend: dayOfWeek === 0 || dayOfWeek === 6
            });
            var t1 = t.getTime();
            t = new Date(t1 + 24 * 60 * 60 * 1000);
        }
        return days;
    }

    getSummaryNumber(shiftId, dayNumber) {
        if (
            this.state.summary[shiftId] &&
            this.state.summary[shiftId][dayNumber]
        )
            return this.state.summary[shiftId][dayNumber];
        return 0;
    }

    fetchCalendarPhase(userId, subdivisionId, monthId) {
        if (userId !== -1 && subdivisionId !== -1 && monthId !== -1) {
            calendarService
                .fetchUserCalendarPhase(userId, subdivisionId, monthId)
                .then(({ phase }) => {
                    this.setState({
                        calendarPhase: phase
                    });
                });
        }
    }

    fetchSummary(roleId, subdivisionId, monthId) {
        if (this.shouldFetchSummary(roleId, subdivisionId, monthId)) {
            calendarService
                .fetchMonthSummary(roleId, subdivisionId, monthId)
                .then(summary => {
                    this.setState({
                        summary
                    });
                });
        }
    }

    fetchCalendar(roleId, subdivisionId, userId, monthId) {
        if (this.shouldFetchCalendar(roleId, subdivisionId, userId, monthId)) {
            calendarService
                .fetchMonthlyCalendar(
                    monthId,
                    userId,
                    this.getShifts(),
                    subdivisionId
                )
                .then(calendar => {
                    this.setState({
                        calendar
                    });
                });
        }
    }

    fetchUsers(roleId, subdivisionId, monthId) {
        if (this.shouldUpdateUsers(roleId, subdivisionId)) {
            userService
                .fetchUsers(roleId, subdivisionId, monthId)
                .then(users => {
                    this.setState({
                        users: users
                    });
                });
        }
    }

    shouldFetchSummary(roleId, subdivisionId, monthId) {
        return (
            roleId &&
            roleId !== -1 &&
            subdivisionId &&
            subdivisionId !== -1 &&
            monthId &&
            monthId !== -1
        );
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
        return (
            this.state.selectedUserId !== -1 &&
            Object.keys(this.state.calendar).length > 0
        );
    }

    isEditable() {
        return calendarService.isEditable(
            this.state.calendarPhase,
            authService.getUserRoleId()
        );
    }

    onSubdivisionSelected(e) {
        var subdivisionId = parseInt(e.target.value);
        this.setState({
            selectedSubdivisionId: subdivisionId,
            selectedUserId: -1,
            response: "",
            responseType: ""
        });
        this.fetchUsers(
            this.state.selectedRoleId,
            subdivisionId,
            this.state.selectedMonthId
        );
        this.fetchCalendarPhase(
            this.state.selectedUserId,
            subdivisionId,
            this.state.selectedMonthId
        );
        this.fetchSummary(
            this.state.selectedRoleId,
            subdivisionId,
            this.state.selectedMonthId
        );
    }

    onUserSelected(e,id) {
        var userId = id || parseInt(e.target.value);
        this.setState({
            selectedUserId: userId,
            response: "",
            responseType: ""
        });
        this.fetchCalendarPhase(
            userId,
            this.state.selectedSubdivisionId,
            this.state.selectedMonthId
        );
        this.fetchCalendar(
            this.state.selectedRoleId,
            this.state.selectedSubdivisionId,
            userId,
            this.state.selectedMonthId
        );
    }

    onRoleSelected(e) {
        this.setState({
            selectedRoleId: parseInt(e.target.value),
            selectedUserId: -1,
            response: "",
            responseType: ""
        });
        this.fetchUsers(
            e.target.value,
            this.state.selectedSubdivisionId,
            this.state.selectedMonthId
        );
        this.fetchSummary(
            e.target.value,
            this.state.selectedSubdivisionId,
            this.state.selectedMonthId
        );
    }

    onMonthSelected(e) {
        var monthId = parseInt(e.target.value);
        this.setState({
            selectedMonthId: monthId,
            response: "",
            responseType: ""
        });
        this.fetchCalendar(
            this.state.selectedRoleId,
            this.state.selectedSubdivisionId,
            this.state.selectedUserId,
            monthId
        );
        this.fetchCalendarPhase(
            this.state.selectedUserId,
            this.state.selectedSubdivisionId,
            monthId
        );
        this.fetchSummary(
            this.state.selectedRoleId,
            this.state.selectedSubdivisionId,
            monthId
        );
        this.fetchUsers(
            this.state.selectedRoleId,
            this.state.selectedSubdivisionId,
            monthId
        );
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

    onCellClicked(dayNumber, shiftId, subdivisionId) {
        if (this.isEditable()) {
            var calendar = JSON.parse(JSON.stringify(this.state.calendar));
            var currentStatus = statusService.getStatusIdFromCurrentShifts(
                shiftId,
                dayNumber,
                calendar
            );
            var newStatus = statusService.shiftStatusId(
                this.state.calendarPhase,
                currentStatus
            );
            if (!calendar[shiftId]) {
                calendar[shiftId] = {};
            }
            calendar[shiftId][dayNumber] = {
                status_id: newStatus,
                subdivision_id: this.state.selectedSubdivisionId
            };
            this.setState({
                calendar
            });
        }
    }

    onChangeCurrent() {
        var calendar = JSON.parse(JSON.stringify(this.state.calendar));
        calendarService
            .saveMonthlyCalendar(
                calendar,
                this.state.selectedUserId,
                this.state.selectedMonthId,
                this.state.selectedSubdivisionId
            )
            .then(cal => {
                this.fetchSummary(
                    this.state.selectedRoleId,
                    this.state.selectedSubdivisionId,
                    this.state.selectedMonthId
                );
                this.setState({
                    response: l.alertCalendarCurrentChanged,
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

    onSaveApproval() {
        var calendar = JSON.parse(JSON.stringify(this.state.calendar));
        calendarService
            .saveMonthlyCalendarApproval(
                calendar,
                this.state.selectedUserId,
                this.state.selectedMonthId,
                this.state.selectedSubdivisionId
            )
            .then(cal => {
                this.fetchSummary(
                    this.state.selectedRoleId,
                    this.state.selectedSubdivisionId,
                    this.state.selectedMonthId
                );
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

    onConfirmApproval() {
        var calendar = JSON.parse(JSON.stringify(this.state.calendar));
        calendarService
            .confirmMonthlyCalendar(
                calendar,
                this.state.selectedUserId,
                this.state.selectedMonthId,
                this.state.calendarPhase,
                this.state.selectedSubdivisionId
            )
            .then(res => {
                var calendar = shiftService.parseShiftsResp(
                    this.getShifts(),
                    res[1]
                );
                this.setState({
                    calendar,
                    calendarPhase: "approved"
                });
                this.fetchSummary(
                    this.state.selectedRoleId,
                    this.state.selectedSubdivisionId,
                    this.state.selectedMonthId
                );
            })
            .catch(err => {
                this.setState({
                    response: l.serverError,
                    responseType: "danger"
                });
            });
    }

    onChangeApproved() {
        var calendar = JSON.parse(JSON.stringify(this.state.calendar));
        calendarService
            .saveMonthlyCalendar(
                calendar,
                this.state.selectedUserId,
                this.state.selectedMonthId,
                this.state.selectedSubdivisionId
            )
            .then(cal => {
                this.fetchSummary(
                    this.state.selectedRoleId,
                    this.state.selectedSubdivisionId,
                    this.state.selectedMonthId
                );
                this.setState({
                    response: l.alertCalendarApprovedChanged,
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

    selectNextTechnician() {
        var { selectedUserId, users } = this.state;
        if (users.length !== 0) {
            var found = -1;
            console.log(selectedUserId,users);
            for (var i = 0; i < users.length; i++) {
                if (users[i].user_id == selectedUserId) {
                    found = i;
                    break;
                }
            }
            found += 1;
            if (found === users.length) {
                found = 0;
            }
            this.onUserSelected(null,users[found].user_id);
        }
    }

    selectPrevTechnician() {
        var { selectedUserId, users } = this.state;
        if (users.length !== 0) {
            var found = -1;
            for (var i = 0; i < users.length; i++) {
                if (users[i].user_id == selectedUserId) {
                    found = i;
                    break;
                }
            }
            found -= 1;
            if (found < 0) {
                found = users.length - 1;
            }
            this.onUserSelected(null, users[found].user_id)
        }
    }

    onArrowLeft() {
        this.selectPrevTechnician();
    }

    onArrowRight() {
        this.selectNextTechnician();
    }

    getTableClassNames() {
        var calendarPhase = this.state.calendarPhase;
        var userRole = authService.getUserRoleId();
        return `technician ${calendarPhase} role-${userRole}`;
    }

    render() {
        var loggedInUserId = authService.getLoggedInUserId();
        var userRoleId = authService.getUserRoleId();
        var { calendarPhase } = this.state;

        return (
            <>
                <h2>{l.technicianCalendar}</h2>
                <div className="selectors">
                    <div className="selectors-left">
                        <Form.Group>
                            <Form.Label>{l.technicianRole}</Form.Label>
                            <Form.Control
                                as="select"
                                name="selected_role"
                                onChange={this.onRoleSelected}
                                value={this.state.selectedRoleId}
                            >
                                <option disabled key={0} value={-1}>
                                    {l.technicianRole}
                                </option>
                                {this.state.roles.map(role => (
                                    <option
                                        key={role.role_id}
                                        value={role.role_id}
                                    >
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
                                    {l.subdivision}
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
                    <div className="selectors-right">
                        <Form.Group className="technician-input">
                            <Form.Label>{l.technician}</Form.Label>
                            <Form.Control
                                as="select"
                                name="selected_technician"
                                onChange={this.onUserSelected}
                                value={this.state.selectedUserId}
                                disabled={!this.shouldUpdateUsers()}
                            >
                                <option disabled key={0} value={-1}>
                                    {l.technician}
                                </option>

                                {this.state.users.map(user => (
                                    <option
                                        key={user.user_id}
                                        value={user.user_id}
                                    >
                                        {user.first_name} {user.last_name} (
                                        {user.username_csr})
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </div>
                </div>
                <Buttons
                    roleId={authService.getUserRoleId()}
                    calendarPhase={this.state.calendarPhase}
                    onSaveApproval={this.onSaveApproval}
                    onConfirmApproval={this.onConfirmApproval}
                    onChangeCurrent={this.onChangeCurrent}
                    onChangeApproved={this.onChangeApproved}
                    onReset={this.onReset}
                />
                <Alerts
                    response={this.state.response}
                    responseType={this.state.responseType}
                    userRoleId={userRoleId}
                    calendarPhase={calendarPhase}
                    noResults={!this.shouldDisplayTable()}
                />
                {this.shouldDisplayTable() ? (
                    <Table
                        className={this.getTableClassNames()}
                        bordered
                        responsive
                        striped
                    >
                        <thead className={"thead-dark"}>
                            <tr>
                                <th className="cross-section">Czas/Dzień</th>
                                {this.getDays().map(d => {
                                    return (
                                        <th
                                            className={
                                                d.weekend ? " weekend" : ""
                                            }
                                            key={d.day_number}
                                            onClick={() => {
                                                this.onDayClick(d.day_number);
                                            }}
                                        >
                                            {d.day_number}
                                            <br />
                                            {l.dayArray[d.day_of_week]}
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
                                            >
                                                <span className="summary">
                                                    {this.getSummaryNumber(
                                                        shift.shift_id,
                                                        day.day_number
                                                    )}
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                ) : (
                    ""
                )}
                <Legend
                    ids={statusService.getStatusIdsForPhase(
                        this.state.calendarPhase,
                        loggedInUserId
                    )}
                ></Legend>
            </>
        );
    }
}

export default withRouter(TechnicianCalendar);
