import * as actionTypes from "../common/constant/ActionTypes"

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

export const setPublishActSpec = (spec) => ({
    type: actionTypes.SET_PUBLISH_ACT_SPEC,
    spec: spec,
});

export const setPublishActDetail = (images, description) => ({
    type: actionTypes.SET_PUBLISH_ACT_DETAIL,
    act: {
        images: images,
        description: description,
    }
});
