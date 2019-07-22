import {
    SET_CURRENT_ACT,
    ADD_COMMENT, CLEAR_CURRENT_ACT, SET_PUBLISH_ACT_COMMON, SET_PUBLISH_ACT_SPEC, SET_PUBLISH_ACT_DETAIL,
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
    currentAct: {
        actId: "",
        comments: [],
        publishTime: "",
        images: [],
        type: "",
        title: "",
        tags: [],
        sponsorName: "",
        sponsorId: "",
        sponsorSignature: "",
        specInfo: {},
    },
    publishAct: {
        actId: "",
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
        publishTime: "",
        images: [],
        type: "",
        title: "",
        tags: [],
        sponsorName: "",
        sponsorId: "",
        sponsorSignature: "",
        specInfo: {},
    },
};

const activity = (state=initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_ACT:
            return Object.assign({}, state, {currentAct: action.act})
        case ADD_COMMENT:
            return Object.assign({}, state, {
                currentAct:
                    state.currentAct.comments.push(action.comment)
            });
        case CLEAR_CURRENT_ACT:
            return Object.assign({}, state, initialState);
        case SET_PUBLISH_ACT_COMMON:
            return Object.assign({}, state, {
                publishAct: {
                    title: action.act.title,
                    endTime: action.act.endTime,
                    type: action.act.type,
                }
            });
        case SET_PUBLISH_ACT_SPEC:
            return Object.assign({}, state, {
                publishAct: getActSpec(state.publishAct.type, action.spec)
            });
        case SET_PUBLISH_ACT_DETAIL:
            return Object.assign({}, state, {
                publishAct: {
                    images: action.act.images,
                    description: action.act.description,
                }
            });
        default:
            return state
    }

};

export default activity;
