import {
    SET_CURRENT_ACT,
    ADD_COMMENT,
    CLEAR_CURRENT_ACT,
    LOAD_ACT_DETAIL_OK,
    LOAD_ACT_DETAIL_FAIL,
    ADD_COMMENT_OK,
    ADD_COMMENT_FAIL,
    ON_LOADING_ACT_DETAIL,
} from "../common/constant/ActionTypes"


// comment format listed as below
/*
{
    id: "",
    content: "",
    time: "",

    // comment publisher and who to reply
    observer: "",
    replyTo: "",

    // activity publisher / the comment publish by ${replyTo}
    replyUnder: "",
}
*/

const initialState = {
    // actId for fetching act detail use,
    actId: "",

    // comments for current activity detail
    comments: [{
        id: "",
        content: "",
        time: "",
        // comment publisher and who to reply
        observer: "",
        replyTo: "",
        // activity publisher / the comment publish by ${replyTo}
        replyUnder: "",
    }],

    // who publish this activity
    sponsorName: "",
    sponsorId: "",
    sponsorSignature: "",

    publishTime: "",
    images: [],
    type: "",
    title: "",
    tags: [],
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
        case ADD_COMMENT_OK:
            return {
                ...state,
                comments: [...action.comments, action.comment],
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
