import {

} from "../common/constant/ActionTypes"
import {SAVE_TAXI_ACT} from "../common/constant/ActionTypes";
import {SAVE_ORDER_ACT} from "../common/constant/ActionTypes";
import {SAVE_TAKEOUT_ACT} from "../common/constant/ActionTypes";
import {SAVE_OTHER_ACT} from "../common/constant/ActionTypes";


const initialState = {
    taxiAct: {
        type: "taxi",
        title: "",
        description:"",
        endTime: "",
        tags: [],
        images: [],
        departTime: "",
        origin: {
            title: "",
        },
        dest: {
            title: "",
        },
        maxMember: 5,
    },
    orderAct: {
        type: "order",
        title: "",
        description:"",
        endTime: "",
        tags: [],
        images: [],
        store: "",
        maxMember: 5,
    },
    takeoutAct: {
        type: "takeout",
        title: "",
        description:"",
        endTime: "",
        tags: [],
        images: [],
        store: "",
        orderTime: "",
        maxMember: 5,
    },
    otherAct: {
        type: "other",
        title: "",
        description:"",
        endTime: "",
        tags: [],
        images: [],
        activityTime: "",
        maxMember: 5,
    },
};


const publishAct = (state=initialState, action) => {
    switch (action.type) {
        case SAVE_TAXI_ACT:
            console.log(action.act);
            return {
                ...state,
                taxiAct: {
                    ...state.taxiAct,
                    ...action.act,
                }
            };
        case SAVE_ORDER_ACT:
            return {
                ...state,
                orderAct: {
                    ...state.orderAct,
                    ...action.act,
                }
            };
        case SAVE_TAKEOUT_ACT:
            return {
                ...state,
                takeoutAct: {
                    ...state.takeoutAct,
                    ...action.act,
                }
            };
        case SAVE_OTHER_ACT:
            return {
                ...state,
                otherAct: {
                    ...state.otherAct,
                    ...action.act,
                }
            };
        default:
            return state
    }
};

export default publishAct;
