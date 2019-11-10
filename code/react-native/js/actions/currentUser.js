import * as actionTypes from "../common/constant/ActionTypes";
import LocalApi from "../api/LocalApi";
import {ON_LOG_OUT} from "../common/constant/ActionTypes";
import {LOG_OUT_FAIL} from "../common/constant/ActionTypes";
import {LOG_OUT_OK} from "../common/constant/ActionTypes";
import XmppApi from "../api/XmppApi";

// simple set user data and update data
export const setUserData = user => ({
        type: actionTypes.SET_USER_DATA,
        data: user
    }
);
export const updateUserInfo = (data) => ({
    type: actionTypes.UPDATE_USER_INFO,
    data: data,
});
export const updateUserAvatar = (data) => ({
    type: actionTypes.UPDATE_USER_AVATAR,
    avatar: data.avatar,
});

export const logout = () => {
    return dispatch => {
        dispatch({
            type: ON_LOG_OUT,
        });
        LocalApi.removeToken()
            .then(() => {
                XmppApi.logout()
                    .then(() => {
                        dispatch({
                            type: LOG_OUT_OK,
                        });
                    })
            })
            .catch(err => {
                dispatch({
                    type: LOG_OUT_FAIL,
                    err,
                });
                console.log(err);
            })
    }
};
