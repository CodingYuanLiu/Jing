import * as actionTypes from "../common/constant/ActionTypes";

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
        default: return state
    }
};

export default currentUser;
