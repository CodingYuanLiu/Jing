import {
    DELETE_TYPE_ACT_OK,
    LOADING_TYPE_FAIL, LOADING_TYPE_OK,
    ON_LOADING_TYPE,
} from "../common/constant/ActionTypes"

const initialState = {
    all: {},
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
                    error: action.err,
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
        case DELETE_TYPE_ACT_OK:
            return deleteAct(state, action);
        default:
            return state;
    }

};
const deleteAct = (state, action) => {
    let type = action.typeName;
    let id = action.id;
    let data = state[type], list = [];
    for(let item of data.items) {
        if (item.id !== id) {
            list.push(item);
        }
    }
    return {
        ...state,
        [type]: {
            items: list,
            isLoading: false,
        }
    }
};
export default typeAct;
