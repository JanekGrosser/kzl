import axios from "axios";
import statusService from "./statusService";

// TODO
class CalendarService {


    fetchDailyCalendar(monthId, roleId, subdivisionId, dayNumber) {
        var promise = new Promise((resolve, reject) => {
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
                    console.error(err);
                    reject();
                });
        });

        return promise;
    }

    /**
     * Converts daily calendar in form of
     * @param {} dailyCalendar
     */
    saveMonthlyCalendar(dailyCalendar) {}

    saveDailyCalendar(dayCalendar, monthId, roleId, dayNumber) {
        var promise = new Promise((resolve, reject) => {
            axios
                .post(
                    `/data/day-calendar`,
                    {
                        shifts: this.reverseConvertDailyCalendarShiftsToDailyCalendarObject(
                            dayCalendar,
                            monthId,
                            dayNumber
                        )
                    },
                    {
                        params: {
                            dayNumber,
                            monthId,
                            roleId
                        }
                    }
                )
                .then(resp => {
                    console.log(resp);
                    resolve();
                })
                .catch(err => {
                    console.error(err);
                    reject();
                });
        });

        return promise;
    }

    confirmDailyCalendar(dayCalendar, monthId, roleId, dayNumber, monthPhase) {

    }

    isEditable(monthPhase, userRoleId) {
        console.log(monthPhase, userRoleId);
        switch (userRoleId) {
            case 1:
                return true;
            case 2:
            case 3:
                return monthPhase === "reservations"
            case 4:
                return false;
            case 5:
                return monthPhase === "current" || 
                    monthPhase === "approval" || 
                    monthPhase === "approved"
            default:
                return false
        }
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
