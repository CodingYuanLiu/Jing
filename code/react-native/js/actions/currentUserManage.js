import {
    GET_USER_MANAGE_ACT_FAIL,
    GET_USER_MANAGE_ACT_OK,
    ON_GET_USER_MANAGE_ACT
} from "../common/constant/ActionTypes";
import Api from "../api/Api";


export const onGetCurrentUserManageAct = (jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_USER_MANAGE_ACT,
        });

        Api.getMyManagedAct(jwt)
            .then(data => {
                dispatch({
                    type: GET_USER_MANAGE_ACT_OK,
                    items: data,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_USER_MANAGE_ACT_FAIL,
                    err,
                })
            })
    };
};
