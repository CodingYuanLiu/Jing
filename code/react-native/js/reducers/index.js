import { combineReducers } from 'redux';
import currentAct from "./currentAct";
import xmpp from "./xmpp";
import recommendAct from "./recommendAct";
import myAct from "./myAct";
import typeAct from "./typeAct";
import currentUser from "./currentUser";
import publishAct from "./publishAct";
import currentUserFollowing from "./currentUserFollowing";
import currentUserFollower from "./currentUserFollower";
import currentUserFeedback from "./currentUserFeedback";
import currentUserJoin from "./currentUserJoin";
import currentUserManage from "./currentUserManage";
import personalHome from "./personalHome";

export default combineReducers({
    currentAct,
    currentUser,
    currentUserFeedback,
    currentUserFollowing,
    currentUserFollower,
    currentUserJoin,
    currentUserManage,
    myAct,
    personalHome,
    publishAct,
    recommendAct,
    typeAct,
    xmpp,
})

