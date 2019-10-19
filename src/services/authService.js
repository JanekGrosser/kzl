
import axios from "axios";

class AuthService {

    constructor() {
        
        this.key = 'authToken';
        this.storage = window.localStorage;
        this.token = this.storage.getItem(this.key);
        
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
        })
    }

    logOut() {
        return new Promise((res,rej) => {
            this._clearToken();
            res();
        });
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
console.log(authService.isLoggedIn());

export default authService;