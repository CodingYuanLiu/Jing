import * as actionTypes from "../common/constant/ActionTypes"
import Api from "../api/Api";
import XmppApi from "../api/XmppApi";
import Dao from "../api/dao/Dao";
import {UPDATE_USER_INFO} from "../common/constant/ActionTypes";


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

export const updateUserInfo = (data) => ({
    type: actionTypes.UPDATE_USER_INFO,
    data: data,
});

export const updateUserAvatar = (avatar) => ({
    type: actionTypes.UPDATE_USER_AVATAR,
    avatar: avatar,
});
