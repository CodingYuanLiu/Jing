import { combineReducers } from 'redux';
import user from "./user";
import currentAct from "./currentAct";
import publishAct from "./publishAct";
import xmpp from "./xmpp";

export default combineReducers({
    user,
    currentAct,
    publishAct,
    xmpp,
})

