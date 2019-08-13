import {
    GET_USER_FOLLOWINGS_FAIL,
    GET_USER_FOLLOWINGS_OK,
    ON_GET_USER_FOLLOWINGS
} from "../common/constant/ActionTypes";
import Api from "../api/Api";


export const loadCurrentUserFollowing = (jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_USER_FOLLOWINGS,
        });

        Api.getFollowings(jwt)
            .then(data => {
                dispatch({
                    type: GET_USER_FOLLOWINGS_OK,
                    items: data,
                })
            })
            .catch(err => {
                dispatch({
                    type: GET_USER_FOLLOWINGS_FAIL,
                    err,
                })
            })
    };
};

// follow action & unFollow action, and get followers and followings
export const onFollow = (from, to, jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_FOLLOW,
        });

        Api.follow(from.id, to.id, jwt)
            .then (data => {
                dispatch({
                    type: FOLLOW_OK,
                    user: to,
                });
                dispatch({
                    type: SET_DETAIL_IS_FRIENDS,
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
            type: actionTypes.ON_UNFOLLOW,
        });
        Api.unFollow(from.id, to.id, jwt)
            .then (data => {
                dispatch({
                    type: UNFOLLOW_OK,
                    user: to,
                });
                dispatch({
                    type: SET_DETAIL_IS_NOT_FRIENDS,
                });
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: UNFOLLOW_FAIL,
                })
            })
    }
};

