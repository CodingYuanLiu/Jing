import {
    FOLLOW_FAIL, FOLLOW_OK,
    GET_USER_FOLLOWINGS_FAIL,
    GET_USER_FOLLOWINGS_OK, ON_FOLLOW,
    ON_GET_USER_FOLLOWINGS, ON_UNFOLLOW, 
    UNFOLLOW_FAIL, UNFOLLOW_OK
} from "../common/constant/ActionTypes";

const initialState = {};

const unFollow = (followings, unFollowId) => {
    let newArray = [];
    for (let user of followings) {
        if (user.id !== unFollowId) {
            newArray.push(user);
        }
    }
    return newArray;
};

const currentUserFollowing = (state = initialState, action) => {
    switch(action.type) {
        case ON_GET_USER_FOLLOWINGS:
            return {
                ...state,
                isLoading: true,
            };
        case GET_USER_FOLLOWINGS_OK:
            return {
                ...state,
                items: action.items,
                isLoading: false,
            };
        case GET_USER_FOLLOWINGS_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.err,
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
                error: action.err,
            };
        case FOLLOW_OK:
            return {
                ...state,
                items: [...state.items, action.user],
                isFollowing: false,
                error: null,
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
                error: action.err,
            };
        case UNFOLLOW_OK:
            return {
                ...state,
                items: unFollow(state.items, action.user.id),
                isUnFollowing: false,
                error: null,
            };
    }
};

export default currentUserFollowing;
