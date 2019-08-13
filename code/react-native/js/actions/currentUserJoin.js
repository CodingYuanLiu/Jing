import {GET_USER_JOIN_ACT_FAIL, GET_USER_JOIN_ACT_OK, ON_GET_USER_JOIN_ACT} from "../common/constant/ActionTypes";
import Api from "../api/Api";


export const loadCurrentUserJoinAct = (jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_USER_JOIN_ACT,
        });

        Api.getMyJoinAct(jwt)
            .then(data => {
                dispatch({
                    type: GET_USER_JOIN_ACT_OK,
                    items: data,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_USER_JOIN_ACT_FAIL,
                    err,
                })
            });
    }
};
