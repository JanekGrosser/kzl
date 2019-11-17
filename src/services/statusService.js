import lang from "../common/lang";

var l = lang();

class StatusService {
    getCountableStatuses() {
        return [2, 3, 5, 6, 8];
    }

    shiftStatusId(calendarStatus, currentStatusId) {
        switch (calendarStatus) {
            case "approval":
                switch (currentStatusId) {
                    case 2:
                        return 4;
                    case 3:
                        return 0;
                    case 4:
                        return 2;
                    default:
                        return 3;
                }
            case "current":
                switch (currentStatusId) {
                    case 8:
                        return 0;
                    case 5:
                        return 9;
                    case 9:
                        return 5;
                    default:
                        return 8;
                }
            case "reservations":
                switch (currentStatusId) {
                    case 1:
                        return 0;
                    default:
                        return 1;
                }
            case "past":
                return currentStatusId;
            default:
                console.error("NO FOUND");
        }
    }

    /**
     * From a user perspective, it doesn't matter if it's approved-added,
     * approved-removed in the current phase.
     * Each phase should set the statuses to a baseline one - for example
     * when going from 3 to 4, statuses should be removed or set as approved
     * @param {} phase
     */
    getStatusIdsForPhase(phase, userRole, calendarType) {
        switch (phase) {
            case "past":
                return [-1];
            case "reservations":
                if (userRole && [2, 3].indexOf(userRole) > -1) return [1, 2];
                return [2];
            case "approval":
                switch(userRole) {
                    case 2:
                    case 3:
                        return [2]
                    default:
                        return [2,3,4]
                }
            case "approved":
                return [5, 6, 7];
            case "current":
                return [5, 8, 9];
            default:
                return [];
        }
    }

    /**
     * status 0 for soft-delete
     * @param {*} monthStatus
     * @param {*} currentStatusId
     */
    shiftStatusIdOnConfirm(monthStatus, currentStatusId) {
        switch (monthStatus) {
            case "approval":
                switch (currentStatusId) {
                    case 2:
                        return 5;
                    case 3:
                        return 6;
                    case 4:
                        return 7;
                    default:
                        return 0;
                }
            case "reservations":
                switch (currentStatusId) {
                    case 1:
                        return 2;
                    default:
                        return 0;
                }
            default:
                console.error("NOT FOUND");
                return 0;
        }
    }

    getAllStatusIds() {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    /**
     *
     */
    getStatusDescriptionForStatusId(id) {
        return l[this.getClassForStatusId(id)];
    }
    /**
     *
     */
    getClassForStatusId(statusId) {
        switch (statusId) {
            case 1:
                return "editable";
            case 2:
                return "approval";
            case 3:
                return "approval-added";
            case 4:
                return "approval-removed";
            case 5:
                return "approved";
            case 6:
                return "approved-added";
            case 7:
                return "approved-removed";
            case 8:
                return "current-added";
            case 9:
                return "current-removed";
            case -1:
                return "past";
            default:
                return "";
        }
    }
    // rotateStatusInDailyCalendar(statusId, initialStatusId) {
    //     switch (statusId) {
    //         case 2:
    //             return 4
    //         case 4:
    //             return 3
    //         case 3:
    //             return initialStatusId
    //         default:
    //             return undefined;
    //     }
    // }
    /**
     *
     * @param {*} shift_id
     * @param {*} day_number
     * @param {*} currentShifts
     */
    getStatusIdFromCurrentShifts(shift_id, day_number, currentShifts) {
        return currentShifts &&
            currentShifts[shift_id] &&
            currentShifts[shift_id][day_number]
            ? currentShifts[shift_id][day_number].status_id
            : undefined;
    }
}

var statusService = new StatusService();

export default statusService;
