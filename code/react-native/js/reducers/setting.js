import {
    SET_LOCATION_CITY,
    TOGGLE_FIND_BY_PHONE_SETTING,
    TOGGLE_SAVE_DATA_SETTING,
    TOGGLE_WATERMARK_SETTING
} from "../common/constant/ActionTypes";

const initialState = {
    waterMarkActive: true,
    saveDataActive: false,
    findByPhoneActive: false,
    city: "上海市",
};
const setting = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_WATERMARK_SETTING:
            return {
                ...state,
                waterMarkActive: action.flag,
            };
        case TOGGLE_FIND_BY_PHONE_SETTING:
            return {
                ...state,
                findByPhoneActive: action.flag,
            };
        case TOGGLE_SAVE_DATA_SETTING:
            return {
                ...state,
                saveDataActive: action.flag,
            };
        case SET_LOCATION_CITY:
            return {
                ...state,
                city: action.city,
            };
        default :
            return state;
    }
};
export default setting;
