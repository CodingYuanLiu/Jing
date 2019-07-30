import * as actionTypes from "../common/constant/ActionTypes";

const initialState = {
    followingList: [],
    followerList: [],
};

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
            console.log(action);
            return {
                ...state,
                ...action.data,
                logged: true,
            };
        case actionTypes.ON_GET_USER_FOLLOWERS:
            return {
                ...state,
                loadingFollowerList: true,
            };
        case actionTypes.GET_USER_FOLLOWERS_OK:
            return {
                ...state,
                followerList: action.followerList,
                loadingFollowerList: false,
            };
        case actionTypes.GET_USER_FOLLOWERS_FAIL:
            return {
                ...state,
                error: action.error,
                loadingFollowerList: false,
            };
        case actionTypes.ON_GET_USER_FOLLOWINGS:
            return {
                ...state,
                loadingFollowingList: true,
            };
        case actionTypes.GET_USER_FOLLOWINGS_OK:
            return {
                ...state,
                followingList: action.followingList,
                loadingFollowingList: false,
            };
        case actionTypes.GET_USER_FOLLOWINGS_FAIL:
            return {
                ...state,
                error: action.error,
                loadingFollowingList: false,
            };
        default: return state
    }
};

export default currentUser;
