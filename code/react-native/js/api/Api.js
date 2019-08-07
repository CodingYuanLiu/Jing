import Dao from "./Dao"
import axios from "axios"
import qs from "qs"
import Model from "./Model";
import LocalApi from "./LocalApi";

axios.defaults.baseURL="http://202.120.40.8:30255";
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
                        // native login response
                        resolve(Model.transferToken(res.data))
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
                resolve(Model.transferUserInfo(res.data))
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
                    // jaccount login response
                    resolve({
                        status: res.data.status,
                        jwt: res.data.jwt_token,
                    })
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
    };
    static updateInfo(data, jwt) {
        return new Promise((resolve, reject) => {
            axios.put("/api/user/info/update", data, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            })
                .then(res => {
                    // this data contains no useful message
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }
    static updateAvatar(avatar, jwt) {
        return new Promise((resolve, reject) => {
            axios.post("/api/user/avatar/upload", avatar, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                }
            })
                .then(res => {
                    resolve(Model.transferUserAvatar(res.data));
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }
    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/public/detail?id=${id}`)
                .then(res => {
                    resolve(Model.transferUserInfo(res.data));
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
                    let acts = res.data ? res.data.acts : [];
                    resolve(Model.transferActivityList(acts));
                    console.log(res.data);
                })
                .catch(err => {
                    err.message = "unknown error";
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
                        'Authorization': `Bearer $res.data){jwt}`,
                    }
                } : null)
                    .then(res => {
                        let acts = res.data ? res.data.acts : [];
                        resolve(Model.transferActivityList(acts));
                    })
                    .catch(err => {
                        Reject(err, reject);
                    })
            })
        }
    }
    // why front end post to back end?
    static recordBehavior(jwt, type, behavior) {
        if (!jwt) return ;
        return new Promise((resolve, reject) => {
            axios.post("/api/user/act/addbehavior", {
                type: type,
                behavior: behavior,
            }, {
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
            })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
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
                    console.log(res.data);
                    let acts = res.data ? res.data : [];
                    resolve(Model.transferActivityList(acts));
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }

    static getActDetail(actId, jwt=null) {
        let id = actId;
        return new Promise((resolve, reject) => {
            axios.get(`/api/public/act/query?act_id=${id}`)
                .then(res => {
                        let data = Model.transferActivityFromSnakeToCamel(res.data);
                        resolve(data);
                        LocalApi.saveRecentScan(data)
                            .catch(err => {
                            });
                        this.recordBehavior(jwt, data.type, "scanning");
                    })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }
    static getMyJoinAct(jwt) {
        return new Promise((resolve, reject) => {
            axios.get("/api/user/act/myact", {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            })
                .then(res => {
                    let acts = res.data ? res.data.acts : [];
                    resolve(Model.transferActivityList(acts));
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }
    static getMyManagedAct(jwt) {
        return new Promise((resolve, reject) => {
            axios.get("/api/user/act/manageact", {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                }
            })
                .then(res => {
                    let acts = res.data ? res.data.acts : [];
                    resolve(Model.transferActivityList(acts));
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
                    resolve({id: res.data.act_id});
                    this.recordBehavior(jwt, data.type, "publish");
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }

    static addComment(comment, jwt) {
        let data = {
            receiver_id: comment.receiver_id,
            content: comment.content,
            act_id :comment.act_id,
            time: comment.time,
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
     *
     * activity applicants api
     */
    static joinAct(act, jwt) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/user/act/join?act_id=${act.id}`, null, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            })
                .then(res => {
                    resolve(res.data);
                    this.recordBehavior(jwt, act.type, "join");
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }

    static getActApplicants(jwt) {
        return new Promise((resolve, reject) => {
            axios.get("/api/user/act/getjoinapp", {
                headers: {
                    'Authorization': `Bearer ${jwt}`
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
    static getUserActStatus = (actId, jwt) => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/user/act/status?act_id=${actId}`, {
                headers: {
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
    };
    static acceptApplicant(actId, userId, jwt) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/user/act/acceptjoin?act_id=${actId}&user_id=${userId}`,
                null, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
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
    static rejectApplicant() {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => {
                    resolve({status: 1, message: "reject ok"})
                }, 1500)
            }catch (err) {
                console.log(err)
            }
        })
    }
    static searchTakeoutStore (keyword) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/public/takeout/searchshop?key=${keyword}`)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }
    static searchAct(text) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/public/act/search?key=${text}`)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }

    /**
     *
     * @param from
     * @param to
     * @param jwt
     * @returns {Promise<R>}
     */

    static follow(from, to, jwt) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/user/follow?id=${to}`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
            })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        });
    }
    static unFollow(from, to, jwt) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/user/unfollow?id=${to}`, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
            })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                    console.log(err);
                })
        });
    }
    static getFollowings(jwt) {
        return new Promise((resolve, reject) => {
            axios.get("/api/user/followings", {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
            })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }
    static getFollowers(jwt) {
        return new Promise((resolve, reject) => {
            axios.get("/api/user/followers", {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
            })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }

}
