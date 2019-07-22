import UserDao from "./dao/UserDao"
import axios from "axios"
import qs from "qs"

axios.defaults.baseURL="https://jing855.cn"
axios.defaults.withCredentials=true

const Reject = (err, reject) => {
    /* Response is Ok */
    if (err.response) {
        reject(err.response)
    } else if (err.request) {
        /* Request is being dealt with */
    } else {
        /* Respone throw error */
        throw err
    }
}

export default class Api {
    /**
     * user api
     */

    static AUTH_TOKEN = null
    static login(username, password) {
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
                        resolve(data.jwt_token)
                    })
                    .catch( err => {
                        Reject(err, reject)
                    })
            }
        )
    }
    static isOnline(jwt) {
        console.log(jwt);
        return new Promise((resolve, reject) => {
            axios.get("/api/user/status", {
                headers:{
                    "Authorization" : "Bearer " + jwt
                }
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                Reject(err, reject)
            })
        })
    }

    static loginWithJaccount(code, redirectUri) {
        return new Promise((resolve, reject) => {
            axios.post("/api/public/login/jaccount", {
                code: code,
                redirect_uri: redirectUri
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }

    static register = (data, jwt) => {
        return new Promise((resolve, reject) => {
            axios.post("/api/public/register", data, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }


    static modifyInfo() {

    }

    /**
     * activity api
     */

    static getAllAct() {
        return new Promise((resolve, reject) => {
            axios.get("/api/public/act/findall")
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }
    static getActDetail(actId) {
        let id = actId
        console.log(id)
        return new Promise((resolve, reject) => {
            axios.get(`/api/public/act/query?act_id=${id}`)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }

    static getMyAct(jwt) {
        return new Promise((resolve, reject) => {
            axios.get("/api/user/act/myact", {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }
    static getManagedAct(jwt) {
        return new Promise((resolve, reject) => {
            axios.get("/api/user/act/manageact", {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }

    static publishAct(jwt, data) {
        return new Promise((resolve, reject) => {
            axios.post("/api/user/act/publish", data, {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }

    static addComment(act, target, comment, jwt) {
        let data = {
            receiver_id: target,
            content: comment,
            act_id :act,
            time: new Date().toISOString().replace("T", " ")
                .replace("Z", "")
        }
        return new Promise((resolve, reject) => {
            axios.post("/api/user/act/comment",data, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            })
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }



    /**
     *
     */
}
