import {
    TOGGLE_FIND_BY_PHONE_SETTING,
    TOGGLE_SAVE_DATA_SETTING,
    TOGGLE_WATERMARK_SETTING
} from "../common/constant/ActionTypes";
import LocalApi from "../api/LocalApi";

const toggleWaterMarkSetting = (flag) => {
    return dispatch => {
        LocalApi.saveWaterMarkSetting(flag)
            .then(() => {
                dispatch({
                    type: TOGGLE_WATERMARK_SETTING,
                    flag: flag,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
};

const toggleSaveDataSetting = (flag) => {
    return dispatch => {
        LocalApi.saveSaveDataSetting(flag)
            .then(() => {
                dispatch({
                    type: TOGGLE_SAVE_DATA_SETTING,
                    flag: flag,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
};

const toggleFindByPhoneSetting = (flag) => {
    return dispatch => {
        LocalApi.saveFindByPhoneSetting(flag)
            .then(() => {
                dispatch({
                    type: TOGGLE_FIND_BY_PHONE_SETTING,
                    flag: flag,
                })
            })
            .catch(err => {
                console.log(err);
            });
    }
};
