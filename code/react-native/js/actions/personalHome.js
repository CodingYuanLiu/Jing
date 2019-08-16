import {
    DISABLE_NEST_SCROLL,
    ENABLE_NEST_SCROLL,
    GET_PERSONAL_FEEDBACK,
    GET_PERSONAL_INFORMATION,
    GET_PERSONAL_MANAGE_ACT
} from "../common/constant/ActionTypes";
import Api from "../api/Api";

export const getPersonalInformation = (id) => {
    return new Promise((resolve, reject) => {
        Api.getUserInfo(id)
            .then(data => {
                dispatch({
                    type: GET_PERSONAL_INFORMATION,
                    user: data,
                })
            })
            .catch(err => {
                console.log(err);
            })
    });
};

export const getPersonalManageAct = (id, jwt) =>{
    return dispatch => {
        Api.getActByUser(id, jwt)
            .then(data => {
                dispatch({
                    type: GET_PERSONAL_MANAGE_ACT,
                    items: data
                });
            })
            .catch(err => {
                console.log(err);
            })
    };
};

export const getPersonalFeedback = (id) => {
    return dispatch => {
        Api.getFeedback(id)
            .then(data => {
                dispatch({
                    type: GET_PERSONAL_FEEDBACK,
                    items: data,
                });
            })
            .catch(err => {
                console.log(err);
            })
    };
};


export const toggleNestScroll = (flag) => {
    return dispatch => {
        if (flag) {
            dispatch({
                type: ENABLE_NEST_SCROLL,
            });
        } else {
            dispatch({
                type: DISABLE_NEST_SCROLL,
            });
        }
    };
};
