import {
    ADD_XMPP_MESSAGE,
    INIT_XMPP_CHATROOMLIST,
    XMPP_LOGIN,
    XMPP_LOGOUT,
    XMPP_SET_USER,
} from "../common/constant/ActionTypes"

const initialState = {
    chatRoomList: [],
};

const initRoomList = (chatRoomList) => {
    let roomList = new Array();
    for (let room of chatRoomList) {
        let initRoom = new Object();
        initRoom.roomId = room;
        initRoom.messages = new Array();
        roomList.push(initRoom);
    }
    return roomList;
};
const addMessageToList = (chatRoom, message, list) => {
    let newList = [...list];
    for (let room of newList){
        if (room.roomId === chatRoom) {
            if (room.messages) {
                room.messages = [message, ...room.messages];
            } else {
                room.messages = [message];
            }
        }
    }
    console.log(newList);
    return newList;
};
const chatRoom = (state=initialState, action) => {
    switch (action.type) {
        case INIT_XMPP_CHATROOMLIST:
            return Object.assign({}, state, {
                chatRoomList: initRoomList(action.chatRoomList)
            });
        case ADD_XMPP_MESSAGE:
            return Object.assign({}, state, {
                chatRoomList: addMessageToList(action.chatRoom, action.message, state.chatRoomList),
            });
        default:
            return state;
    }

};

export default chatRoom;
