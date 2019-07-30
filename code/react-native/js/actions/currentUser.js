import * as actionTypes from "../common/constant/ActionTypes";
import Api from "../api/Api";

// simple set user data and update data
export const setUserData = user => ({
        type: actionTypes.SET_USER_DATA,
        data: user
    }
);
export const updateUserInfo = (data) => ({
    type: actionTypes.UPDATE_USER_INFO,
    data: data,
});
export const updateUserAvatar = (avatar) => ({
    type: actionTypes.UPDATE_USER_AVATAR,
    avatar: avatar,
});

// follow action & unfollow action, and get followers and followings
export const onFollow = (from, to, jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_FOLLOW,
        });

        Api.follow(from.id, to.id, jwt)
            .then (data => {
                dispatch({
                    type: actionTypes.FOLLOW_OK,
                    user: to,
                });

            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.FOLLOW_FAIL,
                })
            })
    }
};
export const onUnFollow = (from, to, jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_UNFOLLOW,
        });
        Api.follow(from.id, to.id, jwt)
            .then (data => {
                dispatch({
                    type: actionTypes.UNFOLLOW_OK,
                    user: to,
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.UNFOLLOW_FAIL,
                })
            })
    }
};

export const onGetFollowings = (jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_GET_USER_FOLLOWINGS,
        });
        Api.getFollowings(jwt)
            .then(data => {
                dispatch({
                    type: actionTypes.GET_USER_FOLLOWINGS_OK,
                    data: data ? data : [],
                });
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.GET_USER_FOLLOWINGS_FAIL,
                    err: err,
                })
            })
    }
};

export const onGetFollowers = (jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_GET_USER_FOLLOWERS,
        });
        Api.getFollowings(jwt)
            .then(data => {
                dispatch({
                    type: actionTypes.GET_USER_FOLLOWERS_OK,
                    data: data ? data : [],
                });
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.GET_USER_FOLLOWERS_FAIL,
                    err: err,
                })
            })
    }
};





