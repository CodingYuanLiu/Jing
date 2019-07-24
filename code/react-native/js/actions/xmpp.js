import * as actionTypes from "../common/constant/ActionTypes";

export const initChatRoomList = (chatRoomList) => ({
    type: actionTypes.INIT_XMPP_CHATROOMLIST,
    chatRoomList: chatRoomList,
});

export const addMessage = (chatRoom, message) => ({
    type: actionTypes.ADD_XMPP_MESSAGE,
    chatRoom: chatRoom,
    message: message,
});

