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
    static transferActivity(data) {
        return {

        }
    }
}
