import {
    SET_CURRENT_ACT,
    ADD_COMMENT,
    CLEAR_CURRENT_ACT,
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
        case SET_CURRENT_ACT:
            return Object.assign({}, state, action.act)
        case ADD_COMMENT:
            return Object.assign({}, state, {
                comments:
                    state.currentAct.comments.push(action.comment)
            });
        case CLEAR_CURRENT_ACT:
            return Object.assign({}, state, initialState);

        default:
            return state
    }

};

export default currentAct;
