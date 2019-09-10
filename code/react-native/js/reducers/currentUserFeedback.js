import {GET_USER_FEEDBACK_FAIL, GET_USER_FEEDBACK_OK, ON_GET_USER_FEEDBACK} from "../common/constant/ActionTypes";

const initialState = {
    isLoading: false,
    items: [],
};

const currentUserFeedback = (state = initialState, action) => {
    switch(action.type) {
        case ON_GET_USER_FEEDBACK:
            return {
                ...state,
                isLoading: true,
            };
        case GET_USER_FEEDBACK_OK:
            return {
                ...state,
                items: action.items,
                isLoading: false,
            };
        case GET_USER_FEEDBACK_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.err,
            };
        default:
            return state;
    }
};

export default currentUserFeedback;
