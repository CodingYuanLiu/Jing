import {
    LOADING_MY_FAIL, LOADING_MY_OK, ON_LOADING_MY,
} from "../common/constant/ActionTypes"

const initialState = {};

const myAct = (state=initialState, action) => {
    switch (action.type) {
        case ON_LOADING_MY:
            return {
                ...state,
                isLoading: true,
            };
        case LOADING_MY_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
            };
        case LOADING_MY_OK:
            return {
                ...state,
                items: action.items,
                isLoading: false,
            };
        default:
            return state;
    }

};

export default myAct
