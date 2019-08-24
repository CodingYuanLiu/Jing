import {
    DELETE_USER_MANAGE_ACT, DELETE_USER_MANAGE_ACT_FAIL, DELETE_USER_MANAGE_ACT_OK,
    GET_USER_MANAGE_ACT_FAIL,
    GET_USER_MANAGE_ACT_OK,
    ON_GET_USER_MANAGE_ACT
} from "../common/constant/ActionTypes";

const initialState = {
    items: [],
    isLoading: false,
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
        case DELETE_USER_MANAGE_ACT_OK:
            return {
                ...state,
                items: this.deleteAct(action.id),
            };
        case DELETE_USER_MANAGE_ACT_FAIL:
                return {
                    ...state,
                    error: action.err,
                };
        default:
            return state;
    }
};

export default currentUserManage;
