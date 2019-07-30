import {
    FOLLOW_FAIL,
    FOLLOW_OK,
    ON_FOLLOW, 
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
        default:
            return state;
    }
};

export default follow
