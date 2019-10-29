
import axios from "axios";


function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

class AuthService {

    constructor() {
        
        this.key = 'authToken';
        this.storage = window.localStorage;
        this.token = this.storage.getItem(this.key);
        if (this.token) {
            this.data = JSON.parse(b64DecodeUnicode(this.token.split(".")[1]));
            axios.defaults.headers.common['Authorization'] = "Bearer " + this.token;
        } else {
            this.data = {};
        }
    }

    isPriviligedRole() {
        return (this.data.role && !this.isRegularRole()) || this.isSuperUserRole();
    }

    isSuperUserRole() {
        return this.data.role && ["adm", "koz"].includes(this.data.role);
    }

    isRegularRole() {
        return this.data.role && ["ser", "ins"].includes(this.data.role);
    }

    getUserData() {
        return this.data;
    }

    getUsername() {
        return this.data.first_name + " " + this.data.last_name;
    }

    getUserCSR() {
        return this.data.username;
    }

    getUserRoleId() {
        return this.data.role_id;
    }

    isLoggedIn() {
        return this.token !== null
    }

    logIn(username_csr,password) {
        return axios.post("/auth/login",{
            username_csr, password
        }).then((res) => {
            this.token = res.data;
            this.storage .setItem(this.key,this.token);
            this.data = JSON.parse(b64DecodeUnicode(this.token.split(".")[1]));
            axios.defaults.headers.common['Authorization'] = "Bearer " + this.token;
        })
    }

    logOut() {
        return new Promise((res,rej) => {
            this._clearToken();
            axios.defaults.headers.common['Authorization'] = undefined;
            res();
        });
    }

    getLoggedInUserId() {
        return this.data.id;
    }

    changePassword(password, newPassword) {
        var userId = this.data.id;
        return axios.post(`/auth/newpassword/${userId}`, { password, newPassword });
    }

    resetPassword(csr) {
        return axios.post(`/auth/resetpassword/${csr}`)
            .then((res) => {
                this._clearToken();
            })
    }

    _clearToken() {
        this.storage.removeItem(this.key);
        this.token = null;
    }

}

var authService = new AuthService();

export default authService;