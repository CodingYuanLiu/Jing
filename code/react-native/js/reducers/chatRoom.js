import {
    ADD_CHAT_ROOM,
    CHAT_ROOM_LOADED,
    ON_LOADING_CHAT_ROOM,
    ON_SEND_MESSAGE, PRESENCE_CHAT_ROOM,

} from "../common/constant/ActionTypes"

const initialState = {
    roomList: [],
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
        case PRESENCE_CHAT_ROOM:
            return {
                ...state,
                [action.room]: {
                    ...state[action.room],
                    init: true,
                }
            };
        default:
            return state;
    }

};

export default chatRoom;
