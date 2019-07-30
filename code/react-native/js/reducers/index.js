import { combineReducers } from 'redux';
import currentAct from "./currentAct";
import publishAct from "./publishAct";
import xmpp from "./xmpp";
import recommendAct from "./recommendAct";
import myAct from "./myAct";
import typeAct from "./typeAct";
import follow from "./follow";
import currentUser from "./currentUser";

export default combineReducers({
    currentAct,
    publishAct,
    xmpp,
    recommendAct,
    myAct,
    typeAct,
    follow,
    currentUser,
})

