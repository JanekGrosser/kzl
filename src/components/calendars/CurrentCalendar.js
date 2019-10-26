import React, { Component } from "react";
import axios from "axios";
import authService from "../../services/authService";
import shiftService from "../../services/shiftService";
import { Table } from "react-bootstrap";
import util from "../../util";

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
                            calendarResp.data
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

    changeStatus() {}

    getStatusIdFromCurrentShifts(shift_id, day_number) {
        return this.state.currentShifts != {} &&
            this.state.currentShifts[shift_id] && this.state.currentShifts[shift_id][day_number]
            ? this.state.currentShifts[shift_id][day_number].status_id
            : "";
    }

    getClassForStatusId(status_id) {
        switch (status_id) {
            case 1:
                return "done";
            case 2:
                return "changed";
            default:
                return "";
        }
    }
    render() {
        console.log(this.state);
        return (
            <>
                <h2>Kalendarz bieżący</h2>
                <h4>Bartosz Grabski (GRA)</h4>
                <h4>Miesiąc - {this.state.currentMonth}</h4>
                <ul className="legenda">
                    <li>
                        <i className="fas fa-stop text-success"></i> - Termin
                        zaakceptowany
                    </li>
                    <li>
                        <i className="fas fa-stop text-warning"></i> - Termin
                        zmieniony
                    </li>
                </ul>
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
                                            className={this.getClassForStatusId(
                                                this.getStatusIdFromCurrentShifts(shift.shift_id,day.day_number)
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
