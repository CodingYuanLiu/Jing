import {
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


const initialState = {
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
    takeoutTime: "",
    activityTime: "",
};


const publishAct = (state=initialState, action) => {
    switch (action.type) {
        case SET_PUBLISH_ACT_COMMON:
            return Object.assign({}, state, {
                    title: action.act.title,
                    endTime: action.act.endTime,
                    type: action.act.type,
            });
        case SET_PUBLISH_TAXI_DEPART:
            return Object.assign({}, state, {
                    departTime: action.departTime,
            });
        case SET_PUBLISH_TAXI_DEST:
            return Object.assign({}, state, {
                    dest: action.dest,
            });
        case SET_PUBLISH_TAXI_ORIGIN:
            return Object.assign({}, state, {
                    origin: action.origin,
            });
        case SET_PUBLISH_ACTIVITY_TIME:
            return Object.assign({}, state, {
                    activityTime: action.activityTime,
            });
        case SET_PUBLISH_ORDER_STORE:
            return Object.assign({}, state, {
                    orderStore: action.store,
            });
        case SET_PUBLISH_TAKEOUT_TIME:
            return Object.assign({}, state, {
                    takeoutTime: action.takeoutTime,
            });
        case SET_PUBLISH_TAKEOUT_STORE:
            return Object.assign({}, state, {
                    takeoutStore: action.store,
            });
        case SET_PUBLISH_ACT_DETAIL:
            return Object.assign({}, state, {
                    images: action.act.images,
                    description: action.act.description,
            });
        default:
            return state
    }

};

export default publishAct;
