import {
    DELETE_USER_MANAGE_ACT, DELETE_USER_MANAGE_ACT_FAIL, DELETE_USER_MANAGE_ACT_OK,
    GET_USER_MANAGE_ACT_FAIL,
    GET_USER_MANAGE_ACT_OK, ON_DELETE_TYPE_ACT, ON_DELETE_USER_MANAGE_ACT,
    ON_GET_USER_MANAGE_ACT
} from "../common/constant/ActionTypes";

const initialState = {
    items: [],
    isLoading: false,
};

const deleteAct = (list, id) => {
    let res = [];
    for(let item of list) {
        if (item.id !== id) {
            res.push(item);
        }
    }

    return res;
};

const currentUserManage = (state = initialState, action) => {
    switch(action.type) {
        case ON_GET_USER_MANAGE_ACT:
            return {
                ...state,
                isLoading: true,
            };
        case GET_USER_MANAGE_ACT_OK:
            return {
                ...state,
                items: action.items,
                isLoading: false,
            };
        case GET_USER_MANAGE_ACT_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.err,
            };
        case DELETE_USER_MANAGE_ACT:
            return {
                ...state,
                isDeleting: true,
            };
        case ON_DELETE_USER_MANAGE_ACT:
            return {
                ...state,
                isLoading: true,
            };
        case DELETE_USER_MANAGE_ACT_OK:
            return {
                ...state,
                items: deleteAct(state.items, action.id),
                isLoading: false,
            };
        case DELETE_USER_MANAGE_ACT_FAIL:
                return {
                    ...state,
                    isLoading: false,
                    error: action.err,
                };
        default:
            return state;
    }
};

export default currentUserManage;
