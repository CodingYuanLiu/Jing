import * as actionTypes from "../common/constant/ActionTypes";
import Api from "../api/Api";

export const getOtherUserData = (userId) => {
    return dispatch => {
        dispatch({
            type:  actionTypes.LOADING_OTHER_USER_DATA,
        });
        Api.getUserInfo(userId)
            .then(data => {
                dispatch({
                    type: actionTypes.LOAD_OTHER_USER_OK,
                    data: data,
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.LOAD_OTHER_USER_FAIL,
                    err,
                })
            })
    }
};





