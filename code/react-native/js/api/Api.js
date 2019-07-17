import UserDao from "./dao/UserDao"
import axios from "axios"
import qs from "qs"

axios.defaults.baseURL="https://jing855.cn"
axios.defaults.withCredentials=true
export default class Api {
    /**
     * user api
     */

    static AUTH_TOKEN = null
    static login(username, password) {
        console.log(username, password)
        return new Promise(
            (resolve, reject) => {
                axios.post("/api/public/login/native", qs.stringify({
                        username: username,
                        password: password,
                    }),
                    {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    })
                    .then(res => {
                        const data = res.data
                        this.AUTH_TOKEN = `Bearer ${data.jwt_token}`
                        console.log(this.AUTH_TOKEN)
                        resolve(data.jwt_token)
                    })
                    .catch( err => {
                        reject(err)
                    })
            }
        )
    }
    static isOnline(jwt) {
        console.log(jwt)
        return new Promise((resolve, reject) => {
            axios.get("/api/public/status", {
                headers:{
                    "Authorization" : "Bearer " + jwt
                }
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }

    static loginWithJaccount(code, redirectUri) {
        console.log(code, redirectUri)
        return new Promise((resolve, reject) => {
            axios.post("/api/public/login/jaccount", {
                code: code,
                redirect_uri: redirectUri
            })
                .then(res => {
                    console.log(res)
                    resolve(res.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }


    static modifyInfo() {

    }

    /**
     * activity api
     */

    static getAllAct() {

    }
    static getMyAct() {

    }
    static getFocusedAct() {

    }
    static getRecAct() {

    }
    static searchAct() {

    }

    /**
     *
     */
}
