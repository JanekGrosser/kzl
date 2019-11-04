
import axios from "axios";
// TODO
class UserService {

    fetchUsers(roleId, subdivisionId) {
        return new Promise((resolve, reject) => {
            axios.get(`/users/list/${subdivisionId}`, {
                params: {
                    role_id: roleId
                }
            })
            .then(resp => {
                resolve(resp.data)
            })
            .catch(err => {
                // TODO better error handling with some codes here
                reject(err)
            })
        });
    }

    fetchAllUsers() {

    }

}

var userService = new UserService();

export default userService;