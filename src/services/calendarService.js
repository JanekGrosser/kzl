import axios from "axios";
import statusService from "./statusService";
import shiftService from "./shiftService";

class CalendarService {

    fetchDailyCalendar(monthId, roleId, subdivisionId, dayNumber) {
        return new Promise((resolve, reject) => {
            axios
                .get(`/data/day-calendar/${subdivisionId}`, {
                    params: {
                        roleId,
                        dayNumber,
                        monthId
                    }
                })
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(err => {
                    // TODO add better error handling with response codes and messages
                    console.error(err);
                    reject(err);
                });
        });
    }

    fetchMonthSummary(roleId, subdivisionId, monthId) {
        return new Promise((resolve, reject) => {
            axios
                .get("/data/shifts-count/", {
                    params: {
                        role_id: roleId,
                        subdivision_id: subdivisionId,
                        month_id: monthId
                    }
                })
                .then(resp => {
                    resolve(this.convertSummaryResponse(resp.data));
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    fetchCurrentCalendar(userId, shifts, subdivisionId) {
        return new Promise((resolve, reject) => {
            axios.get(`/data/current-calendar/${userId}`, {
                params: {
                    subdivision_id: subdivisionId
                }
            })
            .then(resp => {
                resolve(
                    shiftService.parseShiftsResp(shifts, resp.data)
                );
            })
            .catch(err => {
                console.error(err);
                reject(err);
            })
        })
    }

    fetchMonthlyCalendar(monthId, userId, shifts, subdivisionId) {
        return new Promise((resolve, reject) => {
            axios
                .get(`/data/users-calendars/${userId}`, {
                    params: {
                        month_id: monthId,
                        subdivision_id: subdivisionId
                    }
                })
                .then(resp => {
                    resolve(
                        shiftService.parseShiftsResp(shifts, resp.data.shifts)
                    );
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }

    /**
     *
     */
    fetchUserCalendarWithPhase(monthId, userId, shifts, subdivisionId) {
        return new Promise((resolve,reject) => {
                Promise.all([
                this.fetchMonthlyCalendar(monthId, userId, shifts, subdivisionId),
                this.fetchUserCalendarPhase(userId, subdivisionId, monthId)
            ]).then(result => {
                var calendarPhase = result[1].phase
                resolve([result[0], calendarPhase]);
            }).catch(err => {
                reject(err);
            })
        });
    }

    saveMonthlyCalendarApproval(calendar, userId, monthId, subdivisionId) {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `/data/users-calendars/approval-phase/${userId}`,
                    shiftService.toShiftRequestFormat(
                        calendar,
                        monthId,
                        userId
                    ),
                    {
                        params: {
                            month_id: monthId,
                            subdivision_id: subdivisionId
                        }
                    }
                )
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Converts calendar in form of and saves it
     * @param {} calendar
     */
    saveMonthlyCalendar(calendar, userId, monthId, subdivisionId) {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `/data/users-calendars/${userId}`,
                    shiftService.toShiftRequestFormat(
                        calendar,
                        monthId,
                        userId
                    ),
                    {
                        params: {
                            month_id: monthId,
                            subdivision_id: subdivisionId
                        }
                    }
                )
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    sendMonthlyCalendarForApproval(calendar, userId, monthId, allShifts, subdivisionId) {

        var shifts = shiftService.toShiftRequestFormat(
            JSON.parse(JSON.stringify(calendar)),
            monthId,
            userId
        );

        var approvalShifts = shifts.shifts.map(shift => {
            shift.status_id = 2;
            return shift;
        });

        shifts.shifts = approvalShifts;

        return new Promise((resolve,reject) => {
            axios.post(
                `/data/users-calendars/${userId}`, shifts, {
                params: {
                    month_id: monthId,
                    subdivision_id: subdivisionId
                }
            })
            .then(res => {
                resolve(shiftService.parseShiftsResp(
                    allShifts,
                    shifts.shifts,
                    userId
                ))
            })
            .catch(err => {
                reject(err);
            })
        });
    }

    confirmMonthlyCalendar(calendar, userId, monthId, selectedMonthPhase, subdivisionId) {
        var { shifts } = shiftService.toShiftRequestFormat(
            calendar,
            monthId,
            userId
        );
        shifts.map(shift => {
            shift.status_id = statusService.shiftStatusIdOnConfirm(
                selectedMonthPhase,
                shift.status_id
            );
            return shift;
        });
        return new Promise((resolve, reject) => {
            axios
                .post(
                    `/data/users-calendars/approval-phase/${userId}`,
                    { shifts },
                    {
                        params: {
                            month_id: monthId,
                            subdivision_id: subdivisionId
                        }
                    }
                )
                .then(resp => {
                    resolve([resp, shifts]);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    fetchUserCalendarPhase(userId, subdivisionId, monthId) {
        return new Promise((resolve, reject) => {
            axios
                .get(`/data/calendar-phase/`, {
                    params: {
                        month_id: monthId,
                        subdivision_id: subdivisionId,
                        user_id: userId
                    }
                })
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    // /**
    //  * Converts calendar in form of and saves it
    //  * @param {} calendar
    //  */
    // saveCurrentCalendar(calendar, userId, monthId) {
    //     return new Promise((resolve, reject) => {
    //         axios.post(`/data/current-calendar/${userId}`, shiftService.toShiftRequestFormat(calendar), {
    //             params: {
    //                 month_id: monthId
    //             }
    //         })
    //         .then(resp => {
    //             resolve(resp.data);
    //         })
    //         .catch(err => {
    //             reject(err);
    //         })
    //     })
    // }

    // /**
    //  * Saves 'as-is' daily calendar to the backend
    //  * @param {} dayCalendar
    //  * @param {*} monthId
    //  * @param {*} roleId
    //  * @param {*} dayNumber
    //  */
    // saveDailyCalendar(dayCalendar, monthId, roleId, dayNumber) {
    //     var promise = new Promise((resolve, reject) => {
    //         axios
    //             .post(
    //                 `/data/day-calendar`,
    //                 {
    //                     shifts: this.reverseConvertDailyCalendarShiftsToDailyCalendarObject(
    //                         dayCalendar,
    //                         monthId,
    //                         dayNumber
    //                     )
    //                 },
    //                 {
    //                     params: {
    //                         dayNumber,
    //                         monthId,
    //                         roleId
    //                     }
    //                 }
    //             )
    //             .then(resp => {
    //                 resolve();
    //             })
    //             .catch(err => {
    //                 console.error(err);
    //                 reject();
    //             });
    //     });

    //     return promise;
    // }

    // //TODO wont be used for now
    // confirmDailyCalendar(dayCalendar, monthId, roleId, dayNumber, monthPhase) {
    //     var tempDayCalendar = JSON.parse(JSON.stringify(dayCalendar));
    //     Object.keys(tempDayCalendar).forEach(userId => {
    //         Object.keys(tempDayCalendar[userId]).forEach(shiftId => {
    //             tempDayCalendar[userId][
    //                 shiftId
    //             ] = statusService.shiftStatusIdOnConfirm(
    //                 monthPhase,
    //                 tempDayCalendar[userId][shiftId]
    //             );
    //         });
    //     });
    //     //reverseConvertDailyCalendarShiftsToDailyCalendarObject
    // }

    /**
     * 
     * @param {*} calendarPhase 
     * @param {*} userRoleId 
     */
    isEditable(calendarPhase, userRoleId) {
        switch (userRoleId) {
            case 1:
                return true;
            case 2:
            case 3:
                return calendarPhase === "reservations";
            case 4:
                return false;
            case 5:
                return calendarPhase === "current" || calendarPhase === "approval";
            default:
                return false;
        }
    }

    inApproval(calendarPhase) {
        return calendarPhase === "approval";
    }

    /**
     * Returns object
     * {
     *  <shift_1>: {
     *      <day_1>
     *      ...
     *  }
     *  ...
     * }
     * @param {*} summary
     */
    convertSummaryResponse(summary) {
        var converted = {};
        summary.forEach(s => {
            if (!converted[s.shift_id]) converted[s.shift_id] = {};
            converted[s.shift_id][s.day_number] = s.shifts_count;
        });
        return converted;
    }

    /**
     *
     * @param {*} dailyCalendar
     */
    convertDailyCalendarShiftsToDailyCalendarObject(dailyShifts) {
        return dailyShifts.reduce((acc, item) => {
            var shiftIf = item.shift_id;
            var userId = item.user_id;
            if (!acc[userId]) {
                acc[userId] = {};
            }

            acc[userId][shiftIf] = item.status_id;
            return acc;
        }, {});
    }

    reverseConvertDailyCalendarShiftsToDailyCalendarObject(
        dailyCalendar,
        monthId,
        dayNumber
    ) {
        var dayShifts = [];
        Object.keys(dailyCalendar).forEach(userId => {
            Object.keys(dailyCalendar[userId]).forEach(shiftId => {
                var shift = {
                    month_id: monthId,
                    day_number: dayNumber,
                    shift_id: shiftId,
                    user_id: userId,
                    status_id: dailyCalendar[userId][shiftId]
                };
                dayShifts.push(shift);
            });
        });
        return dayShifts;
    }
}

var calendarService = new CalendarService();

export default calendarService;
