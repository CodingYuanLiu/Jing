import {
    GET_USER_JOIN_ACT_FAIL,
    GET_USER_JOIN_ACT_OK,
    ON_GET_USER_JOIN_ACT
} from "../common/constant/ActionTypes";

const initialState = {
    items: [],
    isLoading: false,
};

const currentUserJoin = (state = initialState, action) => {
    switch(action.type) {
        case ON_GET_USER_JOIN_ACT:
            return {
                ...state,
                isLoading: true,
            };
        case GET_USER_JOIN_ACT_OK:
            console.log(action);
            return {
                ...state,
                items: action.items,
                isLoading: false,
            };
        case GET_USER_JOIN_ACT_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.err,
            };
        default:
            return state;
    }
};

export default currentUserJoin;
