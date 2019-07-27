import * as actionTypes from "../common/constant/ActionTypes"
import Api from "../api/Api";

export const setPublishActCommon = (type, title, endTime) => ({
    type: actionTypes.SET_PUBLISH_ACT_COMMON,
    act: {
        title: title,
        endTime: endTime,
        type: type,
    }
});
export const setPublishTaxiDepart = (departTime) => ({
    type: actionTypes.SET_PUBLISH_TAXI_DEPART,
    departTime: departTime,
});
export const setPublishTaxiOrigin = (origin) => ({
    type: actionTypes.SET_PUBLISH_TAXI_ORIGIN,
    origin: origin,
});
export const setPublishTaxiDest = (dest) => ({
    type: actionTypes.SET_PUBLISH_TAXI_DEST,
    dest: dest,
});
export const setPublishTakeoutTime = (takeoutTime) => ({
    type: actionTypes.SET_PUBLISH_TAKEOUT_TIME,
    takeoutTime: takeoutTime,
});
export const setPublishTakeoutStore = (store) => ({
    type: actionTypes.SET_PUBLISH_TAKEOUT_STORE,
    store: store,
});
export const setPublishOrderStore = (store) => ({
    type: actionTypes.SET_PUBLISH_ORDER_STORE,
    store: store,
});
export const setPublishActivityTime = (activityTime) => ({
    type: actionTypes.SET_PUBLISH_ACTIVITY_TIME,
    activityTime: activityTime,
});
export const setPublishActDetail = (images, description) => ({
    type: actionTypes.SET_PUBLISH_ACT_DETAIL,
    act: {
        images: images,
        description: description,
    }
});


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
                    items: data // what if data is null or undefined ?
                });
                console.log(data);
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

const onLoadMyAct = (jwt) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_LOADING_MY,
        });
        Api.getMyAct(jwt)
            .then(data => {
                dispatch({
                    type: actionTypes.LOADING_MY_OK,
                    items: data,
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.LOADING_MY_FAIL,
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
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.LOADING_TYPE_FAIL,
                    err,
                    typeName: type,
                })
            })
    }
};

const onLoadActDetail = (id) => {
    return dispatch => {
        dispatch({
            type: actionTypes.ON_LOADING_ACT_DETAIL,
        });
        Api.getActDetail(id)
            .then(data => {
                dispatch({
                    type: actionTypes.LOAD_ACT_DETAIL_OK,
                    data: data,
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: actionTypes.LOAD_ACT_DETAIL_FAIL,
                    err,
                })
            })
    }
};

const addComment = (comment, jwt) => {
    return dispatch => {
        Api.addComment(comment, jwt)
            .then(data => {
                console.log(data)
                dispatch({
                    type: actionTypes.ADD_COMMENT_OK,
                    comment: comment,
                });
            })
            .catch(err => {
                console.log(err);
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
                console.log(err);
                dispatch({
                    type: actionTypes.LOAD_PUBLISH_FAIL,
                    err,
                })
            })
    }
};


export default {
    onLoadRecommendAct,
    onLoadMyAct,
    onLoadTypeAct,
    onLoadActDetail,
    addComment,
    onLoadPublishDraft,
}
