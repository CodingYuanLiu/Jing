import {GET_USER_FEEDBACK_FAIL, GET_USER_FEEDBACK_OK, ON_GET_USER_FEEDBACK} from "../common/constant/ActionTypes";


export const loadCurrentUserFeedback = (id) => {
    return dispatch => {
        dispatch({
            type: ON_GET_USER_FEEDBACK,
        });

        Api.getFeedback(id)
            .then(data => {
                dispatch({
                    type: GET_USER_FEEDBACK_OK,
                    items: data,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_USER_FEEDBACK_FAIL,
                    err,
                })
            })
    };
};

