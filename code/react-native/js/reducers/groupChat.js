
import {
    FLUSH_GROUP_CHAT_MESSAGE,
    FLUSH_PRIVATE_MESSAGE,
    GET_GROUP_CHAT_HISTORY_OK,
    ON_SEND_GROUP_CHAT_MESSAGE, TOGGLE_HAS_PRESENCE
} from "../common/constant/ActionTypes";
import {ON_GET_GROUP_CHAT_LIST} from "../common/constant/ActionTypes";
import {ON_GET_GROUP_CHAT_HISTORY} from "../common/constant/ActionTypes";
import {GET_GROUP_CHAT_LIST_OK} from "../common/constant/ActionTypes";

const initialState = {
    chatList: [],
    hasLoadHistory: false,
    isLoading: false,
};

const flushGroupChatMessage = (messages, message) => {
    let size = messages.length;
    for(let i = size - 1; i--; i > 0) {
        if(messages[i]._id === message._id) {
            messages[i] = message;
        }
    }
    return [...messages];
};


const addMessage = (state, action) => {
    let duplicate = false;
    if (state[action.id] && state[action.id].messages) {
        for(let item of state[action.id].messages) {
            if (item._id === action.message._id) {
                duplicate = true;
            }
        }

        if (!duplicate) return [...state[action.id].messages, action.message];
        else return [...state[action.id].messages];
    }
    return [action.message];
};

const groupChat = (state=initialState, action) => {
    switch (action.type) {
        case ON_SEND_GROUP_CHAT_MESSAGE:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    messages: addMessage(state, action)
                }
            };
        case ON_GET_GROUP_CHAT_LIST:
            return {
                ...state,
                isLoading: true,
            };
        case GET_GROUP_CHAT_LIST_OK:
            console.log(action.list);
            return {
                ...state,
                isLoading: false,
                chatList: action.list,
            };
        case TOGGLE_HAS_PRESENCE:
            return {
                ...state,
                [action.id]: {
                    hasLoadHistory: true,
                }
            };
        case FLUSH_GROUP_CHAT_MESSAGE:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    messages: flushGroupChatMessage(state[action.id].messages, action.message),
                }
            };
        default:
            return state;
    }

};

export default groupChat;
