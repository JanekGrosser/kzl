import React, { Component } from "react";
import axios from "axios";
import authService from "../../services/authService";
import shiftService from "../../services/shiftService";
import statusService from "../../services/statusService";
import Legend from "../Legend";
import { Table } from "react-bootstrap";
import util from "../../util";
import lang from "../../common/lang";

var l = lang();

class CurrentCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentShifts: {},
            currentMonth: "2000-01",
            currentMonthId: 0,
            shifts: {},
            statuses: []
        };
    }

    componentDidMount() {
        axios
            .all([
                axios.get("/data/status"),
                axios.get("/data/shifts"),
                axios.get(
                    `/data/current-calendar/${authService.getLoggedInUserId()}`
                ),
                axios.get("/data/current-month")
            ])
            .then(
                axios.spread(
                    (statusResp, shiftsResp, calendarResp, monthResp) => {
                        console.log(calendarResp.data);
                        var parsedShifts = shiftService.parseShiftsResp(
                            shiftsResp.data,
                            calendarResp.data,
                            authService.getLoggedInUserId()
                        );
                        this.setState({
                            statuses: statusResp.data,
                            shifts: shiftsResp.data,
                            currentMonthId: monthResp.data.month_id,
                            currentMonth: monthResp.data.year_month,
                            currentShifts: parsedShifts
                        });
                    }
                )
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

    render() {
        console.log(this.state);
        return (
            <>
                <h2>{l.currentCalendar}</h2>
                <h3>
                    {authService.getUsername()} - ({authService.getUserCSR()})
                </h3>
                <h3>
                    {l.month} - {this.state.currentMonth}
                </h3>
                <Legend
                    ids={statusService.getStatusIdsForPhase("current")}
                ></Legend>
                <Table className={"current"} bordered responsive>
                    <thead className={"thead-dark"}>
                        <tr>
                            <th className="cross-section">Czas/Dzień</th>
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
                                                    this.state.currentShifts
                                                )
                                            )}
                                            onClick={() => {}}
                                        ></td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default CurrentCalendar;
