import {
    LOADING_TYPE_FAIL, LOADING_TYPE_OK,
    ON_LOADING_TYPE,
} from "../common/constant/ActionTypes"

const initialState = {
    taxi: {},
    other: {},
    takeout: {},
    order: {},
};

const typeAct = (state=initialState, action) => {
    switch (action.type) {
        case ON_LOADING_TYPE:
            return {
                ...state,
                [action.typeName]: {
                    ...state[action.typeName],
                    isLoading: true,
                }
            };
        case LOADING_TYPE_FAIL:
            return {
                ...state,
                [action.typeName]: {
                    ...state[action.typeName],
                    isLoading: false,
                    err: action.err,
                }
            };
        case LOADING_TYPE_OK:
            return {
                ...state,
                [action.typeName]: {
                    ...state[action.typeName],
                    items: action.items,
                    isLoading: false,
                }
            };
        default:
            return state;
    }

};

export default typeAct;
