import {
    DELETE_USER_MANAGE_ACT_FAIL,
    DELETE_USER_MANAGE_ACT_OK,
    GET_USER_MANAGE_ACT_FAIL,
    GET_USER_MANAGE_ACT_OK, ON_DELETE_USER_MANAGE_ACT,
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

export const onDeleteCurrentUserManageAct = (id, jwt) => {
    return dispatch => {
        dispatch({
            type: ON_DELETE_USER_MANAGE_ACT,
        });
        Api.deleteAct(id, jwt)
            .then(res => {
                console.log(res);
                dispatch({
                    type: DELETE_USER_MANAGE_ACT_OK,
                    id: id,
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: DELETE_USER_MANAGE_ACT_FAIL,
                });
            })
    }
};

