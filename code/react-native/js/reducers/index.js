import { combineReducers } from 'redux';
import currentAct from "./currentAct";
import xmpp from "./xmpp";
import recommendAct from "./recommendAct";
import myAct from "./myAct";
import typeAct from "./typeAct";
import follow from "./follow";
import currentUser from "./currentUser";
import publishAct from "./publishAct";

export default combineReducers({
    currentAct,
    xmpp,
    recommendAct,
    myAct,
    typeAct,
    follow,
    currentUser,
    publishAct,
})

