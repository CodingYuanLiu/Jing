import * as actionTypes from "../common/constant/ActionTypes"
import Api from "../api/Api";

export const setCurrentActivity = act => ({
    type: actionTypes.SET_CURRENT_ACT,
    act: act,
});

export const addComment = comment => ({
    type: actionTypes.ADD_COMMENT,
    comment: comment,
});

export const clearCurrentActivity = () => ({
    type: actionTypes.CLEAR_CURRENT_ACT,
});

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

export default {
    onLoadRecommendAct,
    onLoadMyAct,
    onLoadTypeAct,
}
