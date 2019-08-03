import {
    LOADING_MY_JOIN_FAIL,
    LOADING_MY_JOIN_OK,
    LOADING_MY_MANAGE_FAIL, LOADING_MY_MANAGE_OK, ON_LOADING_MY_JOIN, ON_LOADING_MY_MANAGE,
} from "../common/constant/ActionTypes"

const initialState = {
    joinAct: {},
    manageAct: {},
};

const myAct = (state=initialState, action) => {
    switch (action.type) {
        case ON_LOADING_MY_MANAGE:
            return {
                ...state,
                manageAct: {
                    ...state.manageAct,
                    isLoading: true,
                },
            };
        case LOADING_MY_MANAGE_FAIL:
            return {
                ...state,
                manageAct: {
                    ...state.manageAct,
                    isLoading: false,
                    err: action.err,
                },
            };
        case LOADING_MY_MANAGE_OK:
            return {
                ...state,
                manageAct: {
                    isLoading: false,
                    items: action.items,
                },
            };
        case ON_LOADING_MY_JOIN:
            return {
                ...state,
                joinAct: {
                    ...state.joinAct,
                    isLoading: true,
                }
            };
        case LOADING_MY_JOIN_OK:
            return {
                ...state,
                joinAct: {
                    isLoading: false,
                    items: action.items,
                }
            };
        case LOADING_MY_JOIN_FAIL:
            return {
                ...state,
                joinAct: {
                    ...state.joinAct,
                    isLoading: false,
                    err: action.err
                },
            };
        default:
            return state;
    }

};

export default myAct
