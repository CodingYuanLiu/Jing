import {
    SET_CURRENT_ACT,
    ADD_COMMENT,
    CLEAR_CURRENT_ACT,
    SET_PUBLISH_ACT_COMMON,
    SET_PUBLISH_ACT_DETAIL,
    SET_PUBLISH_TAXI_DEPART,
    SET_PUBLISH_TAXI_DEST,
    SET_PUBLISH_TAXI_ORIGIN,
    SET_PUBLISH_ACTIVITY_TIME,
    SET_PUBLISH_ORDER_STORE,
    SET_PUBLISH_TAKEOUT_TIME,
    SET_PUBLISH_TAKEOUT_STORE,
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
        departTime: "",
        origin: "",
        dest: "",
        store: "",
        orderTime: "",
        activityTime: "",
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
        case SET_PUBLISH_TAXI_DEPART:
            return Object.assign({}, state, {
                publishAct: {
                    departTime: action.departTime,
                }
            });
        case SET_PUBLISH_TAXI_DEST:
            return Object.assign({}, state, {
                publishAct: {
                    dest: action.dest,
                }
            });
        case SET_PUBLISH_TAXI_ORIGIN:
            return Object.assign({}, state, {
                publishAct: {
                    origin: action.origin,
                }
            });
        case SET_PUBLISH_ACTIVITY_TIME:
            return Object.assign({}, state, {
                publishAct: {
                    activityTime: action.activityTime,
                }
            });
        case SET_PUBLISH_ORDER_STORE:
            return Object.assign({}, state, {
                publishAct: {
                    orderStore: action.store,
                }
            });
        case SET_PUBLISH_TAKEOUT_TIME:
            return Object.assign({}, state, {
                publishAct: {
                    takeoutTime: action.takeoutTime,
                }
            });
        case SET_PUBLISH_TAKEOUT_STORE:
            return Object.assign({}, state, {
                publishAct: {
                    takeoutStore: action.store,
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
