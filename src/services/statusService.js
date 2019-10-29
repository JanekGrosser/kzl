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
        console.log(monthStatus,currentStatusId);
        switch(monthStatus) {
            case "approval":
                switch(currentStatusId) {
                    case(2):
                        return 7;
                    case(6):
                        return undefined;
                    case(7):
                        return 2;
                    case undefined:
                        return 6; 
                }
            default:
                console.error("NO FOUND");
        }

    }
    
    getStatusIds() {
        return [1,2,3,4,5,6,7,8,9]
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