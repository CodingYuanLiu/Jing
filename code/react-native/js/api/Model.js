import Util from "../common/util";

export default class Model {
    static transferUserInfo(data) {
        return {
            avatar: data.avatar_url,
            birthday: data.birthday,
            dormitory: data.dormitory,
            gender: data.gender,
            id: data.id,
            jaccount: data.jaccount,
            jwt: data.jwt_token,
            major: data.major,
            nickname: data.nickname,
            password: data.password,
            phone: data.phone,
            signature: data.signature,
            username: data.username,
        };
    }
    static transferUserAvatar(data) {
        return {
            avatar: data.url,
        };
    }
    static transferToken(data) {
        return {
            jwt: data.jwt_token,
        };
    }
    static buildJaccountLogin = (data) => {
        return {
            code: data.code,
            redirect_uri: data.redirectUri,
        }
    };
    /**
     * activity data & list
     * @param data
     * @returns {{sponsor: {signature: *, nickname: *, id: *, avatar: *}, images: (*|[]), comments: *, createTime: *, description: *, id: *, endTime: *, title: *, type: *, tags: (*|[]), status: *}}
     */
    static transferActivityFromSnakeToCamel(data) {
        let act =  {
            id: data.act_id,
            endTime: data.end_time,
            sponsor: {
                id: data.sponsor_id,
                nickname: data.sponsor_username,
                signature: data.signature,
                avatar: data.sponsor_avatar,
            },
            description: data.description,
            title: data.title,
            tags: data.tag ? data.tag : [],
            type: data.type,
            images: data.images ? data.images : [],
            comments: this.transferCommentList(data.comments),
            createTime: data.create_time,
            status: data.status,
        };
        if(act.type === "taxi") {
            act.departTime = data.depart_time;
            act.origin = data.origin;
            act.dest = data.destination;
        } else if (act.type === "order") {
            act.store = data.store;
        } else if (act.type === "takeout" ) {
            act.orderTime = data.order_time;
            act.store = data.store;
        } else if (act.type === "other"){
            act.activityTime = data.activity_time;
        } else {
            // this should not happen
            console.log("activity type is invalid");
        }
        return act;
    }
    static transferActivityList(list) {
        if (!list) {
            return [];
        }
        let res = [];
        for (let item of list) {
            res = [...res, this.transferActivityFromSnakeToCamel(item)];
        }
        return res;
    }
    static buildActivity(publishAct) {
        let images = [];
        for (let img of publishAct.images) {
            img.data ? images.push(img.data) : images.push(img);
        }
        let data = {
            type: publishAct.type,
            end_time: publishAct.endTime,
            create_time: Util.dateTimeToString(new Date()),
            title: publishAct.title,
            description: publishAct.description,
            tag: publishAct.tags,
            images: images,
            max_member: publishAct.maxMember,
        };
        if (data.type === "taxi") {

            data.depart_time = publishAct.departTime;
            data.origin = {
                title: publishAct.origin,
            };
            data.destination = {
                title: publishAct.dest,
            };
        } else if (data.type === "order") {
            data.store = publishAct.store;
        } else if (data.type === "takeout") {

            data.order_time = publishAct.orderTime;
            data.store = publishAct.store;
        } else {
            // type === 'other'
            data.activity_time = publishAct.activityTime;
        }
        return data;
    };

    /**
     * comment item & list
     * @param data
     * @returns {{receiverId: *, receiverName: *, time: *, user: {nickname: *, id: *, avatar: *}, content: *}}
     */
    static transferCommentItem = (data) => {
        return {
            content: data.content,
            receiverId: data.receiver_id,
            receiverName: data.receiver_nickname,
            time: data.time,
            user: {
                nickname: data.user_nickname,
                id: data.user_id,
                avatar: data.user_avatar,
            }
        }
    };
    static transferCommentList = (list) => {
        if (!list) return [];
        let res = [];
        for (let item of list) {
            res.push(this.transferCommentItem(item));
        }
        return res;
    };
    static buildComment = (data) => {
        return {
            receiver_id: data.receiverId,
            receiver_name: data.receiverName,
            content: data.content,
            act_id: data.actId,
            time: data.time,
            user_id: data.user.id,
            user_avatar: data.user.avatar,
            user_nickname: data.user.nickname,
        };
    };

    /**
     * following, follower item & list
     * @param data
     * @returns {{signature: *, nickname: *, id: *, avatar: *}}
     */
    static transferFollowingItem = (data) => {
        return {
            id: data.id,
            nickname: data.nickname,
            avatar: data.avatar_url,
            signature: data.signature,
        }
    };
    static transferFollowingList = (list) => {
        if (!list) return [];
        let res = [];
        for (let item of list) {
            res.push(this.transferFollowingItem(item))
        }
        return res;
    };
    static transferFollowerItem = (data) => {
        return {
            id: data.id,
            nickname: data.nickname,
            avatar: data.avatar_url,
            signature: data.signature,
        }
    };
    static transferFollowerList =(list) => {
        if (!list) return [];
        let res = [];
        for (let item of list) {
            res.push(this.transferFollowerItem(item))
        }
        return res;
    };


    /**
     * feedback item & list
     * @param data
     * @returns {{images: (*|[]), act: {id: *, title: *}, comments: (*|[]), honesty: {data: *, desc: *}, createTime: *, punctuality: {data: *, desc: *}, feedbackId: *, communication: {data: *, desc: *}, user: {nickname: *, id: *, avatar: *}}}
     */
    static transferFeedbackItem = (data) => {
        return {
            act: {
                id: data.act_id,
                title: data.act_title,
            },
            feedbackId: data.feedback_id,
            communication: {
                data: data.communication,
                desc: data.communication_desc,
            },
            honesty: {
                data: data.honesty,
                desc: data.honesty_desc,
            },
            punctuality: {
                data: data.punctuality,
                desc: data.punctuality_desc,
            },
            images: data.fb_images ? data.fb_images : [],
            comments: data.fb_comments ? data.fb_comments : [],
            createTime: data.time,
            user: {
                id: data.user_id,
                avatar: data.user_avatar,
                nickname: data.user_nickname,
            }
        }
    };
    static transferFeedbackList = (list) => {
        if (!list) return [];
        let res = [];
        for (let item of list) {
            res.push(this.transferFeedbackItem(item))
        }
        return res;
    };
    static buildFeedbackItem = (data) => {
        return {
            act_id: data.actId,
            receiver_id: data.receiverId,
            communication: data.communicationData,
            communication_desc: data.communicationDesc,
            punctuality: data.punctualityData,
            punctuality_desc: data.punctualityDesc,
            honesty: data.honestyData,
            honesty_desc: data.honestyDesc,
            time: Util.dateTimeToString(new Date()),
            fb_images: data.feedbackImages,
        }
    };
    static buildFeedbackComment = (data) => {
        return {
            object_id: data.feedbackId,
            time: Util.dateTimeToString(new Date()),
            commentator_desc: data.content,
        };
    };

    /**
     * applicant item & list
     * @param data
     * @returns {{act: {id: *, title: *, type: *}, applicant: {nickname: *, id: *, avatar: *}}}
     */
    static transferApplicantItem = (data) => {
        return {
            act: {
                id: data.act_id,
                title: data.act_title,
                type: data.type,
            },
            applicant: {
                id: data.applicant_id,
                nickname: data.applicant_nickname,
                avatar: data.applicant_avatar,
            },
        }
    };
    static transferApplicantList = (list) => {
        if (!list) return [];
        let res = [];
        for (let item of list ){
            res.push(this.transferApplicantItem(item));
        }
        return res;
    };

    /**
     * participant item & list
     * @param data
     * @returns {{signature: *, nickname: *, id: *, avatar: *}}
     */
    static transferParticipantItem = (data) => {
        return {
            id: data.user_id,
            nickname: data.user_nickname,
            signature: data.user_signature,
            avatar: data.user_avatar,
        }
    };
    static transferParticipantList = (list) => {
        if (!list) return [];
        let res = [];
        for (let item of list ){
            res.push(this.transferParticipantItem(item));
        }
        return res;
    };
}
