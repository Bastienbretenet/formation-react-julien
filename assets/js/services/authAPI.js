import axios from "axios";
import jwtDecode from "jwt-decode";

function authenticate(credentials){
    return axios
        .post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            window.localStorage.setItem("authToken", token);
            setAxiosToken(token)
            return true;
        });
}

function setup(){
    const token = window.localStorage.getItem("authToken");
    if(token){
        const {exp: expiration} = jwtDecode(token)
        if(expiration * 1000 > new Date().getTime() ){
            setAxiosToken(token)
        }
    }
}

function isAuthenticated(){
    const token = window.localStorage.getItem("authToken");
    if(token){
        const {exp: expiration} = jwtDecode(token)
        if(expiration * 1000 > new Date().getTime() ){
            return true
        }else{
            false
        }
    }
    return false
}

function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"]
}

function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

export default{
    authenticate,
    logout,
    setup,
    isAuthenticated
}