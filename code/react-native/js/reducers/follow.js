import {
    FOLLOW_FAIL,
    FOLLOW_OK, GET_FOLLOWERS_FAIL, GET_FOLLOWERS_OK, GET_FOLLOWINGS_FAIL, GET_FOLLOWINGS_OK,
    ON_FOLLOW, ON_GET_FOLLOWERS, ON_GET_FOLLOWINGS,
    ON_UNFOLLOW, UNFOLLOW_FAIL, UNFOLLOW_OK
} from "../common/constant/ActionTypes";


const initialState = {
    followings: [],
    followers: [],
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

const follow = (state=initialState, action) => {
    switch (action.type) {
        case ON_FOLLOW:
            return {
                ...state,
                isLoading: true,
            };
        case FOLLOW_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
            };
        case FOLLOW_OK:
            return {
                ...state,
                followings: [...state.followings, action.user],
                isLoading: false,
                err: null,
            };
        case ON_UNFOLLOW:
            return {
                ...state,
                isLoading: true,
            };
        case UNFOLLOW_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
            };
        case UNFOLLOW_OK:
            return {
                ...state,
                followings: unFollow(state.followings, action.to.id),
                isLoading: false,
                err: null,
            };
        case ON_GET_FOLLOWINGS:
            return {
                ...state,
                loadingFollowings: true,
            };
        case GET_FOLLOWINGS_FAIL:
            return {
                ...state,
                loadingFollowings: false,
                err: action.err,
            };
        case GET_FOLLOWINGS_OK:
            return {
                ...state,
                loadingFollowings: false,
                followings: action.data,
            };
        case ON_GET_FOLLOWERS:
            return {
                ...state,
                loadingFollowers: true,
            };
        case GET_FOLLOWERS_FAIL:
            return {
                ...state,
                loadingFollowers: false,
                err: action.err,
            };
        case GET_FOLLOWERS_OK:
            return {
                ...state,
                loadingFollowers: false,
                followers: action.data,
            };
        default:
            return state;
    }
};

export default follow
