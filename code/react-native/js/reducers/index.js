import { combineReducers } from 'redux';
import currentAct from "./currentAct";
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
import setting from "./setting";
import personalHome from "./personalHome";
import chatRoom from "./chatRoom";
import privateChat from "./privateChat";

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
    setting,
    chatRoom,
    privateChat,
})

