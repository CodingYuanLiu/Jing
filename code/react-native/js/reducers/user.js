import {
    LOGIN, LOGIN_FAIL, LOGIN_OK,
    LOGOUT, ON_NATIVE_LOGIN,
    SET_USER, UPDATE_USER_AVATAR, UPDATE_USER_INFO
} from "../common/constant/ActionTypes"
import {updateUserInfo} from "../actions/user";

const initialState = {
    logged: false,
};

const user = (state=initialState, action) => {
    switch (action.type) {
        case ON_NATIVE_LOGIN:
            return {
                ...state,
                logged: false,
            };
        case LOGIN_OK:
            return {
                ...state,
                logged: true,
                ...action.data
            };
        case LOGIN_FAIL:
            return {
                ...state,
                logged: false,
                err: action.err
            };
        case LOGIN:
            return Object.assign({}, state, {logged: true, jwt: action.jwt});
        case LOGOUT:
            return initialState;
        case SET_USER:
            return {
                ...state,
                ...action.user,
                logged: true,
            };
        case UPDATE_USER_INFO:
            return {
                ...state,
                ...action.data,
            };
        case UPDATE_USER_AVATAR:
            return {
                ...state,
                ...action.avatar,
            };
        default:
            return state;
    }

};

export default user
