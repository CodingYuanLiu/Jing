import {
    LOAD_ACT_DETAIL_OK,
    LOAD_ACT_DETAIL_FAIL,
    ADD_COMMENT_OK,
    ADD_COMMENT_FAIL,
    ON_LOADING_ACT_DETAIL, RESET_ACT_DETAIL,
} from "../common/constant/ActionTypes"

const initialState = {
    // actId for fetching act detail use,
    id: "",

    // comments for current activity detail
    comments: [],

    // who publish this activity
    sponsor: {
        avatar: "",
        signature: "",
        nickname: "",
        id: 0,
    },

    createTime: "",
    images: [],
    type: "",
    title: "",
    tags: [],
    description: "",
    isLoading: false,
};


const currentAct = (state=initialState, action) => {
    switch (action.type) {
        case ON_LOADING_ACT_DETAIL:
            return {
                ...state,
                isLoading: true,
            };
        case LOAD_ACT_DETAIL_OK:
            return {
                ...state,
                isLoading: false,
                ...action.data
            };
        case LOAD_ACT_DETAIL_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
            };
        case RESET_ACT_DETAIL:
            return initialState;
        case ADD_COMMENT_OK:
            return {
                ...state,
                comments: [...state.comments, action.comment],
            };
        case ADD_COMMENT_FAIL:
            return {
                ...state,
                err: action.err,
            };
        default:
            return state
    }
};

export default currentAct;
