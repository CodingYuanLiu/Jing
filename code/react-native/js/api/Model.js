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
        return data.url;
    }
    static transferToken(data) {
        return data.jwt_token;
    }
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
            comments: data.comments,
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
    static transferFollowingItem(data) {
        return {
            id: data.id,
            nickname: data.nickname,
            avatar: data.avatar_url,
            signature: data.signature,
        }
    }

    // transfer from camel to snake,
    static transferActivityFromCamelToSnake(publishAct) {
        let images = new Array();
        for (let img of publishAct.images) {
            images.push(img.data);
        }
        let data = {
            type: publishAct.type,
            end_time: publishAct.endTime,
            create_time: Util.dateTimeToString(new Date()),
            title: publishAct.title,
            description: publishAct.description,
            tag: publishAct.tags,
            images: images,
            max_member: 5,
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
    }
}
