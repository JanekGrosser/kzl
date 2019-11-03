import lang from "../common/lang";

var l = lang();

/**
 * Month phases
 * 2 - approval
 * 3 - approved/Review
 * 4 - current
 */

 /**
  * 			
STATUS		AKCJA(KLIK)	
approval	2	approval-removed	7
<null>	null	approval-added	6
approval-added	6	<null>	<null>
approval-removed	7	approval	2
  */
class StatusService {

    getCountableStatuses() {
        return [2,3,5,6,8]
    }

    shiftStatusId(monthStatus, currentStatusId) {
        switch(monthStatus) {
            case "approval":
                switch(currentStatusId) {
                    case(2):
                        return 4;
                    case(3):
                        return undefined;
                    case(4):
                        return 2;
                    case undefined:
                        return 3; 
                }
            case "current":
                //switch()
                switch(currentStatusId) {
                    case 8:
                        return undefined;
                    case 5:
                        return 9;
                    case 9:
                        return 5;
                    case undefined:
                        return 8;
                }
            case "reservations":
                switch(currentStatusId) {
                    case 1:
                        return undefined;
                    case undefined:
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
    getStatusIdsForPhase(phase) {
        switch (phase) {
            case "past":
                return [0]
            case "reservations":
                return [2];
            case "approval":
                return [2,3,4];
            case "approved":
                return [5,6,7];
            case "current":
                return [5,8,9];
            default:
                return [2,3,4,5,6];
        }
    }

    getStatusAfterConfirm(monthStatus, statusId) {

    }
    
    getAllStatusIds() {
        return [0,1,2,3,4,5,6,7,8,9]
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
            case 0:
                return "past";
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
            : "";
    }
};

var statusService = new StatusService();

export default statusService;