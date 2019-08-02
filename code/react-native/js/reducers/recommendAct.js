import {
    LOADING_RECOMMEND_FAIL, LOADING_RECOMMEND_OK,
    ON_LOADING_RECOMMEND,
} from "../common/constant/ActionTypes"

const initialState = {};

const recommendAct = (state=initialState, action) => {
    switch (action.type) {
        case ON_LOADING_RECOMMEND:
            return {
                ...state,
                isLoading: true,
            };
        case LOADING_RECOMMEND_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
            };
        case LOADING_RECOMMEND_OK:
            console.log(action);
            return {
                ...state,
                items: action.items,
                isLoading: false,
            };
        default:
            return state;
    }

};

export default recommendAct;
