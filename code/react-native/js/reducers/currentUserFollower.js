import {
    GET_USER_FOLLOWERS_FAIL,
    GET_USER_FOLLOWERS_OK,
    ON_GET_USER_FOLLOWERS,
} from "../common/constant/ActionTypes";

const initialState = {
    isLoading: false,
    items: [],
};

const currentUserFollower = (state = initialState, action) => {
    switch(action.type) {
        case ON_GET_USER_FOLLOWERS:
            return {
                ...state,
                isLoading: true,
            };
        case GET_USER_FOLLOWERS_OK:
            return {
                ...state,
                items: action.items,
                isLoading: false,
            };
        case GET_USER_FOLLOWERS_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.err,
            };
        default:
            return state;
    }
};

export default currentUserFollower;
