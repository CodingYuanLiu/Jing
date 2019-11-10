import {
    DELETE_TYPE_ACT_FAIL,
    DELETE_TYPE_ACT_OK,
    LOADING_TYPE_FAIL, LOADING_TYPE_OK, ON_DELETE_TYPE_ACT,
    ON_LOADING_TYPE,
} from "../common/constant/ActionTypes"
import {save} from "@react-native-community/cameraroll";
import {stat} from "react-native-fs";

const initialState = {
    all: {},
    taxi: {},
    other: {},
    takeout: {},
    order: {},
};

const deleteTypeAct = (list, id) => {
    let res = [];
    for (let item of list) {
        if (id !== item.id) {
            res.push(item);
        }
    }
    return res;
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
        case ON_DELETE_TYPE_ACT:
            return {
                ...state,
                [action.typeName]: {
                    ...state[action.typeName],
                    isLoading: true,
                }
            };
        case DELETE_TYPE_ACT_OK:
            return {
                ...state,
                [action.typeName]: {
                    ...state[action.typeName],
                    items: deleteTypeAct(state[action.typeName].items, action.id),
                    isLoading: false,
                }
            };
        case DELETE_TYPE_ACT_FAIL:
            return {
                ...state,
                [action.typeName]: {
                    ...state[action.typeName],
                    isLoading: false,
                }
            };
        default:
            return state;
    }

};

export default typeAct;
