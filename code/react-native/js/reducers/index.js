import { combineReducers } from 'redux';
import user from "./user";
import currentAct from "./currentAct";
import publishAct from "./publishAct";
import xmpp from "./xmpp";
import recommendAct from "./recommendAct";
import myAct from "./myAct";
import typeAct from "./typeAct";
import follow from "./follow";

export default combineReducers({
    user,
    currentAct,
    publishAct,
    xmpp,
    recommendAct,
    myAct,
    typeAct,
    follow,
})

