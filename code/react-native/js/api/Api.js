import Dao from "./dao/Dao"
import axios from "axios"
import qs from "qs"

axios.defaults.baseURL="https://jing855.cn";
axios.defaults.withCredentials=true;

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
};

export default class Api {
    /**
     * user api
     */

    static AUTH_TOKEN = null;
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
    static getSelfDetail(jwt) {
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


    static modifyInfo(jwt, data) {
        return new Promise((resolve, reject) => {
            axios.post("/api/user/info/update", data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                }
            })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
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
    static getActByType(type, jwt = null) {
        if (type === "all") {
            return this.getAllAct();
        } else {
            return new Promise((resolve, reject) => {
                axios.get(`/api/public/act/findbytype?type=${type}`, jwt ? {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                    }
                } : null)
                    .then(res => {
                        resolve(res.data);
                    })
                    .catch(err => {
                        Reject(err, reject);
                    })
            })
        }
    }

    static getRecommendAct(jwt) {
        let token = jwt;
        return new Promise((resolve, reject) => {
            axios.get("/api/user/act/recommendact", {
                headers: {
                    'Authorization': `Bearer ${token}`,
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

    static getActDetail(actId) {
        let id = actId;
        console.log(id);
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
            time: Util.dateTimeToString(new Date())
        };
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
     * getSavedPublishAct
     */
    static getDraftPublish() {
        return new Promise((resolve, reject) => {
            Dao.get("@draft")
                .then(data => {
                    // should be an array
                    resolve(JSON.parse(data))
                })
                .catch(err => {
                    // not fount or some other error
                    reject(err);
                })
        })
    }

    static saveDraftPublish(publishAct) {
        return new Promise( async (resolve) => {
            let data = await Dao.get("@draft");
            let dataList = JSON.parse(data);
            dataList.push(publishAct);
            await Dao.saveJson(JSON.stringify(dataList));
            resolve()
        })
    }
}
