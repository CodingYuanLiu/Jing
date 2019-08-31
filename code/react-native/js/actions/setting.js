import {
    HAS_SKIPPED_LOGIN,
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
const onLoadSettings = () => {
    return dispatch => {
          loadSettingsAsync()
              .then(res => {
                  dispatch({
                      type: TOGGLE_SAVE_DATA_SETTING,
                      flag: res.saveDataActive,
                  });
                  dispatch({
                      type: TOGGLE_WATERMARK_SETTING,
                      flag: res.waterMarkActive,
                  });
                  dispatch({
                      type: TOGGLE_FIND_BY_PHONE_SETTING,
                      flag: res.findByPhoneAvtive,
                  });
              })
              .catch(e => {
                  saveDefaultSetting()

                      .catch(err => {
                          console.log(err);
                      });
              })
    };
};
const hasSkipLogin = () => {
    return dispatch => {
        LocalApi.getSkipLogin()
            .then(hasSkipLogin => {
                dispatch({
                    type: HAS_SKIPPED_LOGIN,
                    flag: hasSkipLogin,
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: HAS_SKIPPED_LOGIN,
                    flag: false,
                })
            })
    };
};
const toggleSkipLogin = (flag) => {
    return dispatch => {
        LocalApi.saveSkipLogin(flag)
            .then(() => {
                dispatch({
                    type: HAS_SKIPPED_LOGIN,
                    flag: flag,
                })
            })
            .catch(err => {
                console.log(err);
                dispatch({
                    type: HAS_SKIPPED_LOGIN,
                    flag: false,
                })
            })
    };
};
const saveDefaultSetting = async () => {
    await LocalApi.saveFindByPhoneSetting(false);
    await LocalApi.saveSaveDataSetting(false);
    await LocalApi.saveWaterMarkSetting(true);
};
const loadSettingsAsync = async () => {
    let res = {};
    res.waterMarkActive = await LocalApi.getWaterMarkSetting();
    res.saveDataActive = await LocalApi.getSaveDataSetting();
    res.findByPhoneAvtive = await LocalApi.getFindByPhoneSetting();
    console.log(res);
    return res;
};
export {
    toggleFindByPhoneSetting,
    toggleSaveDataSetting,
    toggleWaterMarkSetting,
    onLoadSettings,
    hasSkipLogin,
    toggleSkipLogin,
}
