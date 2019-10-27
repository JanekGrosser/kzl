import authService from "./authService";

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
}

var shiftService = new ShiftService();

export default shiftService;
