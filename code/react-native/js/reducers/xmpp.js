import {
    ADD_CHAT_ROOM,
    CHAT_ROOM_LOADED,
    ON_LOADING_CHAT_ROOM,
    ON_SEND_MESSAGE,

} from "../common/constant/ActionTypes"

const initialState = {
    roomList: [],
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
        case ON_SEND_MESSAGE:
            return {
                ...state,
                [action.room]: {
                    ...state[action.room],
                    messages: state[action.room] && state[action.room].messages?
                        [action.message, ...state[action.room].messages]
                        : [action.message]
                }
            };
        case ADD_CHAT_ROOM:
            return {
                ...state,
                [action.room]: {
                    ...state[action.room],
                    id: action.room,
                    name: action.roomName
                },
                roomList: [{id: action.room, name: action.roomName}, ...state.roomList],
            };
        case ON_LOADING_CHAT_ROOM:
            return {
                ...state,
                isLoading: true,
            };
        case CHAT_ROOM_LOADED:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }

};

export default chatRoom;
