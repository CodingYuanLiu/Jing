import * as actionTypes from "../common/constant/ActionTypes"
import Api from "../api/Api";
import XmppApi from "../api/XmppApi";
import Dao from "../api/dao/Dao";
import NavigationUtil from "../navigator/NavUtil";
import Util from "../common/util";

export const login = jwt => ({
    type: actionTypes.LOGIN,
    logged: true,
    jwt
});

export const logout = () => ({
    type: actionTypes.LOGOUT,
    logged: false,
});

export const setUser = user => ({
        type: actionTypes.SET_USER,
        user: user
    }
);

/**
 * asynchronous actions
 */

export const onloginNative = (username, password, callback) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_NATIVE_LOGIN,
            isLoading: true,
        });
        Api.login(username, password)
            .then(jwt => {
                Dao.saveString("@jwt", jwt)
                    .then(() => {
                        Api.getSelfDetail(jwt)
                            .then(data => {
                                console.log(data);
                                XmppApi.login('aa', 'aa')
                                    .then(() => {
                                        dispatch({
                                            type: actionTypes.LOGIN_OK,
                                            data: {
                                                avatar: data.avatar_url,
                                                birthday: data.birthday,
                                                dormitory: data.dormitory,
                                                gender: data.gender,
                                                id: data.id,
                                                jaccount: data.jaccount,
                                                jwt: data.jwt,
                                                major: data.major,
                                                nickname: data.nickname,
                                                password: data.password,
                                                phone: data.phone,
                                                signature: data.signature,
                                                username: data.username,
                                            }
                                        });
                                        callback();
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        // this should not happen,
                                        // at least not because password is not correct
                                    })
                            })
                    })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.LOGIN_FAIL,
                    err,
                })
            })
    }
};
