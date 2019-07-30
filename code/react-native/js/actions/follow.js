import {useDispatch} from "react-redux";
import Api from "../api/Api";
import {
    FOLLOW_FAIL,
    FOLLOW_OK, GET_FOLLOWERS_FAIL, GET_FOLLOWERS_OK, GET_FOLLOWINGS_FAIL, GET_FOLLOWINGS_OK,
    ON_FOLLOW, ON_GET_FOLLOWERS, ON_GET_FOLLOWINGS,
    ON_UNFOLLOW,
    UNFOLLOW_FAIL,
    UNFOLLOW_OK
} from "../common/constant/ActionTypes";

export const onFollow = (from, to, jwt) => {
    return dispatch => {
        dispatch({
            type: ON_FOLLOW,
        });

        Api.follow(from.id, to.id, jwt)
            .then (data => {
                dispatch({
                    type: FOLLOW_OK,
                    user: to,
                });

            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: FOLLOW_FAIL,
                })
            })
    }
};
export const onUnFollow = (from, to, jwt) => {
    return dispatch => {
        dispatch({
            type: ON_UNFOLLOW,
        });
        Api.follow(from.id, to.id, jwt)
            .then (data => {
                dispatch({
                    type: UNFOLLOW_OK,
                    user: to,
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: UNFOLLOW_FAIL,
                })
            })
    }
};

export const onGetFollowings = (jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_FOLLOWINGS,
        });
        Api.getFollowings(jwt)
            .then(data => {
                dispatch({
                    type: GET_FOLLOWINGS_OK,
                    data: data ? data : [],
                });
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: GET_FOLLOWINGS_FAIL,
                    err: err,
                })
            })
    }
};

export const onGetFollowers = (jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_FOLLOWERS,
        });
        Api.getFollowings(jwt)
            .then(data => {
                dispatch({
                    type: GET_FOLLOWERS_OK,
                    data: data ? data : [],
                });
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: GET_FOLLOWERS_FAIL,
                    err: err,
                })
            })
    }
};
