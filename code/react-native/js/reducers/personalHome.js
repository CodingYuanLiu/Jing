import {
    DISABLE_NEST_SCROLL,
    ENABLE_NEST_SCROLL,
    GET_PERSONAL_FEEDBACK,
    GET_PERSONAL_INFORMATION,
    GET_PERSONAL_MANAGE_ACT
} from "../common/constant/ActionTypes";


const initialState = {
    feedbackList: [],
    information: {},
    actList: [],
};

const personalHome = (state = initialState, action) => {
    switch (action.type) {
        case GET_PERSONAL_FEEDBACK:
            return {
                ...state,
                feedbackList: action.items,
                nestScrollEnabled: false,
            };
        case GET_PERSONAL_INFORMATION:
            return {
                ...state,
                information: action.user,
                nestScrollEnabled: false,
            };
        case GET_PERSONAL_MANAGE_ACT:
            return {
                ...state,
                actList: action.items,
                nestScrollEnabled: false,
            };
        case ENABLE_NEST_SCROLL:
            return {
                ...state,
                nestScrollEnabled: true,
            };
        case DISABLE_NEST_SCROLL:
            return {
                ...state,
                nestScrollEnabled: false,
            };
        default :
            return state;
    }
};
export default personalHome;
