import React, { Component } from "react";
import axios from "axios";
import authService from "../../services/authService";
import statusService from "../../services/statusService";
import shiftService from "../../services/shiftService";
import Legend from "../Legend";
import { Table, Form } from "react-bootstrap";
import util from "../../util";
import lang from "../../common/lang";
import calendarService from "../../services/calendarService";
import Select from "react-select";

var l = lang();

class CurrentCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentShifts: {},
            currentMonth: "2000-01",
            currentMonthId: 0,
            shifts: {},
            statuses: [],
            subdivisions: [],
            selectedSubdivisions: [],
            subdivisionsIdToName: {}
        };

        this.onSubdivisionSelected = this.onSubdivisionSelected.bind(this);
    }

    componentDidMount() {
        var userId = authService.getLoggedInUserId();

        axios.get("/data/current-month").then(currentMonthResp => {
            this.setState({
                currentMonthId: currentMonthResp.data.month_id,
                currentMonth: currentMonthResp.data.year_month
            });
        });

        axios
            .all([
                axios.get("/data/status"),
                axios.get("/data/shifts"),
                axios.get("/data/subdivisions")
            ])
            .then(
                axios.spread((statusResp, shiftsResp, subdivisionsResp) => {
                    this.setState({
                        statuses: statusResp.data,
                        shifts: shiftsResp.data,
                        subdivisions: subdivisionsResp.data,
                        subdivisionIdToName: subdivisionsResp.data.reduce(
                            (acc, curr) => {
                                acc[curr.subdivision_id] =
                                    curr.subdivision_name;
                                return acc;
                            },
                            {}
                        ),
                        selectedSubdivisions: this.getValuesForSelect(
                            subdivisionsResp.data
                        )
                    });
                    calendarService
                        .fetchCurrentCalendar(userId, shiftsResp.data)
                        .then(calendar => {
                            this.setState({
                                currentShifts: calendar
                            });
                        })
                        .catch(err => {
                            //console.
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
        var currentMonth = parseInt(this.state.currentMonth.split("-")[1]) - 1;
        var t = new Date(
            this.state.currentMonth.split("-")[0],
            currentMonth,
            1
        );
        var days = [];
        while (t.getMonth() == currentMonth) {
            days.push({
                day_number: t.getDate()
            });
            var t1 = t.getTime();
            t = new Date(t1 + 24 * 60 * 60 * 1000);
        }
        return days;
    }

    shouldDisplayTable() {
        return (
            Object.keys(this.state.currentShifts).length > 0 &&
            this.state.selectedSubdivisions.length > 0
        );
    }

    onSubdivisionSelected(selectedSubdivisions) {
        selectedSubdivisions = selectedSubdivisions === null ? [] : selectedSubdivisions;
        this.setState({
            selectedSubdivisions
        });
    }

    getValuesForSelect(subdivisions) {
        subdivisions = subdivisions || this.state.subdivisions;
        return subdivisions.map(({ subdivision_name, subdivision_id }) => {
            return {
                label: subdivision_name,
                value: subdivision_id
            };
        });
    }

    getSubdivisionForTableCell(shiftId, dayNumber) {
        if (this.state.currentShifts[shiftId][dayNumber]) {
            return this.state.subdivisionIdToName[this.state.currentShifts[shiftId][dayNumber].subdivision_id];
        }
        return "";
    }

    render() {

        var userId = authService.getLoggedInUserId();
        var monthId = this.state.currentMonthId;
        var filteredShifts = shiftService.toShiftRequestFormat(this.state.currentShifts, monthId, userId);
        filteredShifts.shifts = filteredShifts.shifts.filter(shift => {
            return this.state.subdivisionIdToName[shift.subdivision_id] !== undefined;
        })
        var filtered = shiftService.parseShiftsResp(this.getShifts(), filteredShifts.shifts);
        return (
            <>
                <h2>{l.currentCalendar}</h2>
                <h3>
                    {authService.getUsername()} - ({authService.getUserCSR()})
                </h3>
                <div className="selectors">
                    <Form.Group>
                        <h3>
                            {l.month} - {this.state.currentMonth}
                        </h3>
                    </Form.Group>
                    <Form.Group>
                        <Select
                            isMulti
                            className="select"
                            value={this.state.selectedSubdivisions}
                            onChange={this.onSubdivisionSelected}
                            options={this.getValuesForSelect()}
                            placeholder={l.subdivision}
                        />
                    </Form.Group>
                </div>
                {this.shouldDisplayTable() ? (
                    <>
                        <Table className={"current"} bordered responsive>
                            <thead className={"thead-dark"}>
                                <tr>
                                    <th className="cross-section">
                                        Czas/Dzień
                                    </th>
                                    {this.getDays().map(d => {
                                        return <th>{d.day_number}</th>;
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {this.getShifts().map(shift => {
                                    return (
                                        <tr>
                                            <td>
                                                {util.convertMinsToHrsMins(
                                                    shift.shift_start
                                                )}
                                            </td>
                                            {this.getDays().map(day => (
                                                <td
                                                    className={statusService.getClassForStatusId(
                                                        statusService.getStatusIdFromCurrentShifts(
                                                            shift.shift_id,
                                                            day.day_number,
                                                            filtered
                                                        )
                                                    )}
                                                    onClick={() => {}}
                                                >
                                                    <span className={"subdivision"
                                                    }>{this.getSubdivisionForTableCell(
                                                        shift.shift_id,
                                                        day.day_number
                                                    )}</span>
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                        <Legend
                            ids={statusService.getStatusIdsForPhase("current")}
                        ></Legend>
                    </>
                ) : (
                    ""
                )}
            </>
        );
    }
}

export default CurrentCalendar;
