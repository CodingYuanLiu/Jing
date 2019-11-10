import * as actionTypes from "../common/constant/ActionTypes";
import {LOG_OUT_OK} from "../common/constant/ActionTypes";
import {ON_LOG_OUT} from "../common/constant/ActionTypes";
import {DEFAULT_IMAGE} from "../common/constant/Constant";
import {LOG_OUT_FAIL} from "../common/constant/ActionTypes";

const initialState = {};

const currentUser = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER_LOGGED:
            return {
                ...state,
                logged: true,
            };
        case actionTypes.SET_USER_TOKEN:
            return {
                ...state,
                jwt: action.jwt,
            };
        case actionTypes.SET_USER_DATA:
            return {
                ...state,
                ...action.data,
                logged: true,
            };
        case actionTypes.UPDATE_USER_INFO:
            return {
                ...state,
                ...action.data,
            };
        case actionTypes.UPDATE_USER_AVATAR:
            return {
                ...state,
                avatar: action.avatar
            };
        case ON_LOG_OUT:
            return {
                ...state,
                isLoading: true,
            };
        case LOG_OUT_OK:
            return {
                logged: false,
                avatar: DEFAULT_IMAGE,
            };
        case LOG_OUT_FAIL:
            return {
                error: action.err,
            };
        default: return state
    }
};

export default currentUser;
