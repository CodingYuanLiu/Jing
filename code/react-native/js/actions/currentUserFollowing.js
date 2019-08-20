import {
    FOLLOW_FAIL,
    FOLLOW_OK,
    GET_USER_FOLLOWINGS_FAIL,
    GET_USER_FOLLOWINGS_OK,
    ON_GET_USER_FOLLOWINGS, SET_DETAIL_IS_FRIENDS, SET_DETAIL_IS_NOT_FRIENDS, UNFOLLOW_FAIL, UNFOLLOW_OK
} from "../common/constant/ActionTypes";
import Api from "../api/Api";


export const onGetCurrentUserFollowing = (jwt) => {
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
export const onFollow = (from, to, jwt, that) => {
    return dispatch => {
        that.setState({isFollowing: true});
        Api.follow(from.id, to.id, jwt)
            .then (data => {
                dispatch({
                    type: FOLLOW_OK,
                    user: to,
                });
                dispatch({
                    type: SET_DETAIL_IS_FRIENDS,
                });
                that.setState({isFriends: true});
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: FOLLOW_FAIL,
                })
            })
            .finally(() => {
                that.setState({isFollowing: false});
            })
    }
};
export const onUnFollow = (from, to, jwt, that) => {
    return dispatch => {
        that.setState({isUnFollowing: true});
        Api.unFollow(from.id, to.id, jwt)
            .then (data => {
                dispatch({
                    type: UNFOLLOW_OK,
                    user: to,
                });
                dispatch({
                    type: SET_DETAIL_IS_NOT_FRIENDS,
                });
                that.setState({isFriends: false});
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: UNFOLLOW_FAIL,
                })
            })
            .finally(() => {
                that.setState({isUnFollowing: false})
            })
    }
};

