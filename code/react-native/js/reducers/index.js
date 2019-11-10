import { combineReducers } from 'redux';
import currentAct from "./currentAct";
import recommendAct from "./recommendAct";
import typeAct from "./typeAct";
import currentUser from "./currentUser";
import publishAct from "./publishAct";
import currentUserFollowing from "./currentUserFollowing";
import currentUserFollower from "./currentUserFollower";
import currentUserFeedback from "./currentUserFeedback";
import currentUserJoin from "./currentUserJoin";
import currentUserManage from "./currentUserManage";
import setting from "./setting";
import personalHome from "./personalHome";
import groupChat from "./groupChat";
import privateChat from "./privateChat";

export default combineReducers({
    currentAct,
    currentUser,
    currentUserFeedback,
    currentUserFollowing,
    currentUserFollower,
    currentUserJoin,
    currentUserManage,
    personalHome,
    publishAct,
    recommendAct,
    typeAct,
    setting,
    groupChat,
    privateChat,
})

