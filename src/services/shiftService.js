import authService from "./authService";
import statusService from "./statusService";

class ShiftService {
    /**
     * Returns shifts parsed to format of
     * {
     *   <shift_0_id>: {
     *      <day_x_num>: <status_id>
     *      <day_y_num>: <status_id>
     *  },
     *  <shift_1_id>: [
     *      ...
     *  ]
     * }
     * @param {*} shifts
     * @param {*} currentShifts
     */
    parseShiftsResp(shifts, currentShifts) {
        var parsed = {};

        shifts
            .filter(shift => shift.role_id === authService.getUserRoleId())
            .forEach(shift => {
                var a = shift;
                if (!parsed[shift.shift_id]) parsed[shift.shift_id] = {};
                currentShifts
                    .filter(curr_shift => curr_shift.shift_id == a.shift_id)
                    .forEach(curr_shift => {
                        parsed[shift.shift_id][curr_shift.day_number] = {
                            status_id: curr_shift.status_id
                        };
                    });
            });

        return parsed;
    }

    /**
     * Reverse operation to parseShiftsResp. Creates
     * an object to be sent to save as a shift calendar
     * @see parseShiftsResp
     * @param {} currentShifts
     */
    toShiftRequestFormat(currentShifts, monthId, userId) {
        var shifts = [];

        Object.keys(currentShifts).map(s => parseInt(s)).forEach(shiftId => {
            Object.keys(currentShifts[shiftId]).map(d => parseInt(d)).forEach(dayNumber => {
                shifts.push({
                    shift_id: shiftId,
                    month_id: monthId,
                    day_number: dayNumber,
                    user_id: userId,
                    status_id: currentShifts[shiftId][dayNumber].status_id
                })
            });
        })

        return {
            shifts
        }

    }

        /**
     * 
     * @param {*} dayCalendar - day calendar object 
     * @param {*} possibleShiftsObject 
     * @returns {object} { <shift_id>: <count> }
     */
    getDayCalendarSummary(dayCalendar, possibleShiftsObject) {
        console.log(possibleShiftsObject);
        var obj = possibleShiftsObject.reduce((acc,shift) => {
            acc[shift.shift_id] = 0
            return acc;
        },{});
        var countableStatuses = statusService.getCountableStatuses();
        Object.keys(dayCalendar).forEach(userId => {
            Object.keys(dayCalendar[userId]).forEach(shiftId => {
                if (countableStatuses.indexOf(dayCalendar[userId][shiftId]) > -1) {
                    obj[shiftId]++
                }
            });
        })
        return obj;
    }
}

var shiftService = new ShiftService();

export default shiftService;
