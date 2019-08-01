import * as actionTypes from "../common/constant/ActionTypes";
import {ON_FOLLOW} from "../common/constant/ActionTypes";
import {FOLLOW_FAIL} from "../common/constant/ActionTypes";
import {FOLLOW_OK} from "../common/constant/ActionTypes";
import {ON_UNFOLLOW} from "../common/constant/ActionTypes";
import {UNFOLLOW_FAIL} from "../common/constant/ActionTypes";
import {UNFOLLOW_OK} from "../common/constant/ActionTypes";

const initialState = {
    followingList: [],
    followerList: [],
    isFollowing: false,
    isUnFollowing: false,
};

const unFollow = (followings, unFollowId) => {
    let newArray = new Array();
    for (let user of followings) {
        if (user.id !== unFollowId) {
            newArray.push(user);
        }
    }
    return newArray;
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
                followerList: action.data,
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
                followingList: action.data,
                loadingFollowingList: false,
            };
        case actionTypes.GET_USER_FOLLOWINGS_FAIL:
            return {
                ...state,
                error: action.error,
                loadingFollowingList: false,
            };
        case ON_FOLLOW:
            return {
                ...state,
                isFollowing: true,
            };
        case FOLLOW_FAIL:
            return {
                ...state,
                isFollowing: false,
                err: action.err,
            };
        case FOLLOW_OK:
            return {
                ...state,
                followingList: [...state.followingList, action.user],
                isFollowing: false,
                err: null,
            };
        case ON_UNFOLLOW:
            return {
                ...state,
                isUnFollowing: true,
            };
        case UNFOLLOW_FAIL:
            return {
                ...state,
                isUnFollowing: false,
                err: action.err,
            };
        case UNFOLLOW_OK:
            return {
                ...state,
                followingList: unFollow(state.followingList, action.user.id),
                isUnFollowing: false,
                err: null,
            };
        default: return state
    }
};

export default currentUser;
