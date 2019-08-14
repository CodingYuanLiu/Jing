import * as actionTypes from "../common/constant/ActionTypes"
import Api from "../api/Api";
import Model from "../api/Model";

/**
 * asynchronous action
 */
const onLoadRecommendAct = (jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_LOADING_RECOMMEND,
        });
        Api.getRecommendAct(jwt)
            .then(data => {
                dispatch({
                    type: actionTypes.LOADING_RECOMMEND_OK,
                    items: data
                });
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.LOADING_RECOMMEND_FAIL,
                    err,
                })
            })
    }
};

const onLoadMyManageAct = (jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_LOADING_MY_MANAGE,
        });
        Api.getMyManagedAct(jwt)
            .then(data => {
                dispatch({
                    type: actionTypes.LOADING_MY_MANAGE_OK,
                    items: data,
                });
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.LOADING_MY_MANAGE_FAIL,
                    err,
                })
            })
    }
};
const onLoadMyJoinAct = (jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_LOADING_MY_JOIN,
        });
        Api.getMyJoinAct(jwt)
            .then(data => {
                dispatch({
                    type: actionTypes.LOADING_MY_JOIN_OK,
                    items: data,
                });
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.LOADING_MY_JOIN_FAIL,
                    err,
                })
            })
    }
};

const onLoadTypeAct = (type) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_LOADING_TYPE,
            typeName: type,
        });
        Api.getActByType(type)
            .then(data => {
                dispatch({
                    type: actionTypes.LOADING_TYPE_OK,
                    items: data,
                    typeName: type,
                });
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.LOADING_TYPE_FAIL,
                    err,
                    typeName: type,
                })
            })
    }
};

const onLoadActDetail = (id, jwt, currentUserId, followingList) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_LOADING_ACT_DETAIL,
        });
        Api.getActDetail(id, jwt)
            .then(data => {
                let isSelf = data.sponsor.id === currentUserId,
                    isFriends = false;
                for (let item of followingList) {
                    if (item.id === data.sponsor.id) {
                        isFriends = true;
                    }
                }
                data.isSelf = isSelf;
                data.isFriends = isFriends;
                dispatch({
                    type: actionTypes.LOAD_ACT_DETAIL_OK,
                    data: data,
                });
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.LOAD_ACT_DETAIL_FAIL,
                    err,
                })
            })
    }
};
const resetActDetail = () => ({
   type: actionTypes.RESET_ACT_DETAIL,
});
const addComment = (comment, jwt) => {
    return dispatch => {
        Api.addComment(Model.buildComment(comment), jwt)
            .then(data => {
                dispatch({
                    type: actionTypes.ADD_COMMENT_OK,
                    comment: comment,
                });
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.ADD_COMMENT_FAIL,
                    err,
                })
            })
    }
};

const onLoadPublishDraft = () => {
    return dispatch => {
        Dao.get("@draft")
            .then(res => {
                let data = JSON.parse(res);
                dispatch({
                    type: actionTypes.LOAD_PUBLISH_OK,
                    data: data[0],
                })
            })
            .catch(err => {
                dispatch({
                    type: actionTypes.LOAD_PUBLISH_FAIL,
                    err,
                })
            })
    }
};

const saveTaxiAct = (act) => ({
    type: actionTypes.SAVE_TAXI_ACT,
    act: act,
});
const saveOrderAct = (act) => ({
    type: actionTypes.SAVE_ORDER_ACT,
    act: act,
});
const saveTakeoutAct = (act) => ({
    type: actionTypes.SAVE_TAKEOUT_ACT,
    act: act,
});
const saveOtherAct = (act) => ({
    type: actionTypes.SAVE_OTHER_ACT,
    act: act,
});
export default {
    onLoadRecommendAct,
    onLoadMyJoinAct,
    onLoadMyManageAct,
    onLoadTypeAct,
    onLoadActDetail,
    resetActDetail,
    addComment,
    onLoadPublishDraft,
    saveTaxiAct,
    saveTakeoutAct,
    saveOrderAct,
    saveOtherAct,
}
