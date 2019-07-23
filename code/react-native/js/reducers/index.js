import { combineReducers } from 'redux';
import user from "./user";
import currentAct from "./currentAct";
import publishAct from "./publishAct";

export default combineReducers({
    user,
    currentAct,
    publishAct,
})

