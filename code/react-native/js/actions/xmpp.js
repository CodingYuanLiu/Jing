import * as actionTypes from "../common/constant/ActionTypes";

export const initChatRoomList = (chatRoomList) => ({
    type: actionTypes.INIT_XMPP_CHATROOMLIST,
    chatRoomList: chatRoomList,
});

export const addMessage = (chatRoom, message) => ({
    type: actionTypes.ADD_XMPP_MESSAGE,
    chatRoom: chatRoom,

    // message format conforms to gifted chat
    message: message,
});

export const addChatRoom = (room, roomName) => ({
    type: actionTypes.ADD_CHAT_ROOM,
    room: room,
    roomName: roomName,
});

export const onSendMessage = (room, message) => ({
    type: actionTypes.ON_SEND_MESSAGE,
    room: room,
    message: message,
});

