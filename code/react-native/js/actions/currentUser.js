import * as actionTypes from "../common/constant/ActionTypes";
import Api from "../api/Api";

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



