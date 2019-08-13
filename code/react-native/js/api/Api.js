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
     *
     * @param username
     * @param password
     * @returns {Promise<R>}
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

                        /**
                         * jwt: data.jwt_token
                         */
                        resolve(Model.transferToken(res.data))
                    })
                    .catch( err => {
                        Reject(err, reject)
                    })
            }
        )
    }

    /**
     *
     * @param jwt
     * @returns {Promise<R>}
     */
    static getSelfDetail(jwt) {
        return new Promise((resolve, reject) => {
            axios.get("/api/user/status", {
                headers:{
                    "Authorization" : "Bearer " + jwt
                }
            }).then(res => {

                /**
                 * avatar: data.avatar_url,
                 * birthday: data.birthday,
                 * dormitory: data.dormitory,
                 * gender: data.gender,
                 * id: data.id,
                 * jaccount: data.jaccount,
                 * jwt: data.jwt_token,
                 * major: data.major,
                 * nickname: data.nickname,
                 * password: data.password,
                 * phone: data.phone,
                 * signature: data.signature,
                 * username: data.username,
                 */
                resolve(Model.transferUserInfo(res.data))
            }).catch(err => {
                Reject(err, reject)
            })
        })
    }

    /**
     *
     * @param code - oauth2, code
     * @param redirectUri - oauth2, redirect_url
     * @returns {Promise<R>}
     */
    static loginWithJaccount(code, redirectUri) {
        return new Promise((resolve, reject) => {
            axios.post("/api/public/login/jaccount", {
                code: code,
                redirect_uri: redirectUri
            })
                .then(res => {
                    let data = res.data;

                    /**
                     * status: data.status,
                     * jwt: data.jwt_token
                     */
                    resolve({
                        status: data.status,
                        jwt: data.jwt_token,
                    })
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    }

    /**
     *
     * @param data - object,
     *  {
     *      username,
     *      password,
     *      nickname,
     *      phone,
     *  }
     * @param jwt
     * @returns {Promise<R>}
     */
    static register = (data, jwt) => {
        return new Promise((resolve, reject) => {
            axios.post("/api/public/register", data, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            })
                .then(res => {
                    /**
                     * message
                     */
                    resolve(res.data)
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    };

    /**
     *
     * @param data - object,
     *  {
     *      id,
     *      phone - optional,
     *      signature - optional,
     *      nickname - optional,
     *      major - optional,
     *      dormitory - optional,
     *      birthday - optional,
     *      gender - optional,
     *  }
     * @param jwt
     * @returns {Promise<R>}
     */
    static updateInfo(data, jwt) {
        return new Promise((resolve, reject) => {
            axios.put("/api/user/info/update", data, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            })
                .then(res => {

                    /**
                     * message,
                     */
                    resolve(res.data);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }

    /**
     *
     * @param avatar - base64
     * @param jwt
     * @returns {Promise<R>}
     */
    static updateAvatar(avatar, jwt) {
        return new Promise((resolve, reject) => {
            axios.post("/api/user/avatar/upload", avatar, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                }
            })
                .then(res => {

                    /**
                     * avatar
                     */
                    resolve(Model.transferUserAvatar(res.data));
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }

    /**
     *
     * @param id
     * @returns {Promise<R>}
     */
    static getUserInfo(id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/public/detail?id=${id}`)
                .then(res => {

                    /**
                     * avatar: data.avatar_url,
                     * id: data.id,
                     * birthday: data.birthday,
                     * dormitory: data.dormitory,
                     * gender: data.gender,
                     * major: data.major,
                     * nickname: data.nickname,
                     * phone: data.phone,
                     * signature: data.signature,
                     * privacy: data.privacy
                     */
                    resolve(Model.transferUserInfo(res.data));
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }

    /**
     * @param page - optional
     * @returns {Promise<R>}
     */
    static getAllAct(page = null) {
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

    /**
     *
     * @param jwt
     * @param type
     * @param behavior
     * @returns {Promise<R>}
     */
    static recordBehavior(type, behavior, jwt) {
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

    /**
     *
     * @param jwt - recommend need to login
     * @returns {Promise<R>}
     */
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
                        this.recordBehavior(data.type, "scanning", jwt)
                            .catch(err => {
                                console.log(err);
                            })
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

    /**
     *
     * @param jwt
     * @param data
     * @returns {Promise<R>}
     */
    static publishAct(data, jwt) {
        return new Promise((resolve, reject) => {
            axios.post("/api/user/act/publish", data, {
                headers: {
                    "Authorization": `Bearer ${jwt}`,
                }
            })
                .then(res => {
                    resolve({id: res.data.act_id});
                    this.recordBehavior(data.type, "publish", jwt)
                        .catch(err => {
                            console.log(err);
                        })
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
                    this.recordBehavior(act.type, "join", jwt)
                        .catch(err => {console.log(err)})
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

                    /**
                     * act: {
                     *     id: data.act_id,
                     *     title: data.act_title,
                     *     type: data.type,
                     * },
                     * applicant: {
                     *     id: data.applicant_id,
                     *     nickname: data.applicant_nickname,
                     *     avatar: data.applicant_avatar,
                     * }
                     *
                     */
                    let data = res.data;
                    resolve(Model.tra);
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }
    static getActParticipants(id) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/public/act/getactivitymember?act_id=${id}`)
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
                    let acts = res.data ? res.data.acts : [];
                    resolve(Model.transferActivityList(acts));
                    //this.recordBehavior().catch(err => {console.log(err)});
                })
                .catch(err => {
                    Reject(err, reject);
                })
        })
    }

    /**
     *
     * @param data - object
     *  {
     *
     *  }
     * @param jwt
     * @returns {Promise<R>}
     */
    static publishFeedback = (data, jwt) => {
        return new Promise((resolve, reject) => {
            axios.post("api/user/feedback/publish", data, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            })
                .then(res => {

                    /**
                     * feedbackId: data.feedback_id
                     */
                    let data = res.data;
                    resolve({feedbackId: data.feedback_id});
                })
                .catch(err => {
                    Reject(err, reject)
                })
        })
    };

    /**
     *
     * @param id - user id
     * @returns {Promise<R>}
     */
    static getFeedback = (id) => {
        return new Promise((resolve, reject) => {
            axios.get(`api/public/feedback/query?receiver_id=${id}`)
                .then(res => {

                    /**
                     *  act: {
                     *      id: data.act_id,
                     *      title: data.act_title,
                     *  },
                     *  feedbackId: data.feedback_id,
                     *  communication: {
                     *      data: data.communication,
                     *      desc: data.communication_desc,
                     *  },
                     *  honesty: {
                     *      data: data.honesty,
                     *      desc: data.honesty_desc,
                     *  },
                     *  punctuality: {
                     *      data: data.punctuality,
                     *      desc: data.punctuality_desc,
                     *  },
                     *  images: data.fb_images,
                     *  comments: data.fb_comments ? data.fb_comments : [],
                     *  createTime: data.time,
                     *  user: {
                     *      id: data.user_id,
                     *      avatar: data.user_avatar,
                     *      nickname: data.user_nickname,
                     *  }
                     *
                     */
                    let data = res.data;
                    resolve(Model.transferFeedbackList(data));
                })
                .catch(err => {
                    Reject(err, reject);
                })
        });
    };

    /**
     *
     * @param id - feedback id
     * @param jwt
     * @returns {Promise<R>}
     */
    static deleteFeedback = (id, jwt) => {
        return new Promise((resolve, reject) => {
             axios.post('api/user/feedback/delete', {
                 object_id: id,
             }, {
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
        });
    };
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
