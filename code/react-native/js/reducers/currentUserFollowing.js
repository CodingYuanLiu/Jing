import {
    FOLLOW_FAIL, FOLLOW_OK,
    GET_USER_FOLLOWINGS_FAIL,
    GET_USER_FOLLOWINGS_OK,
    ON_GET_USER_FOLLOWINGS,
    UNFOLLOW_FAIL, UNFOLLOW_OK
} from "../common/constant/ActionTypes";

const initialState = {
    isLoading: false,
    items: [],
};

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
        case FOLLOW_FAIL:
            return {
                ...state,
                error: action.err,
            };
        case FOLLOW_OK:
            return {
                ...state,
                items: [...state.items, action.user],
                error: null,
            };
        case UNFOLLOW_FAIL:
            return {
                ...state,
                error: action.err,
            };
        case UNFOLLOW_OK:
            return {
                ...state,
                items: unFollow(state.items, action.user.id),
                error: null,
            };
        default:
            return state;
    }
};

export default currentUserFollowing;
