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
        spec: {},
    },
    publishAct: {
        // common field of activities
        type: "",
        title: "",
        endTime: "",

        // detail field for activity
        images: [],
        tags: [],
        description: "",

        /* spec for each activity,
         * Taxi: {
         *      departTime,
         *      origin,
         *      dest
         * }
         * Takeout: {
         *      store,
         *      orderTime,
         * }
         *
         * activity: {
         *      activityTime,
         * }
         * order: {
         *      store,
         * }
         *
         */
        spec: {},
    },
};

const getActSpec = (type, spec) => {
    if (type === "taxi") {
        return {
            departTime: spec.departTime,
            origin: spec.origin,
            dest: spec.dest,
        };
    } else if (type === "takeout") {
        return {
            store: spec.store,
            orderTime: spec.orderTime,
        };
    } else if (type === "order") {
        return {
            store: spec.store,
        };
    } else return {
        activityTime: spec.activityTime,
    };
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
                publishAct: {
                    spec: getActSpec(state.publishAct.type, action.spec),
                }
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
