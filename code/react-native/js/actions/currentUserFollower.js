import {GET_USER_FOLLOWERS_FAIL, GET_USER_FOLLOWERS_OK, ON_GET_USER_FOLLOWERS} from "../common/constant/ActionTypes";
import Api from "../api/Api";


export const loadCurrentUserFollower = (jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_USER_FOLLOWERS,
        });

        Api.getFollowers(jwt)
            .then(data => {
                dispatch({
                    type: GET_USER_FOLLOWERS_OK,
                    items: data,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_USER_FOLLOWERS_FAIL,
                    err,
                })
            });
    };
};
