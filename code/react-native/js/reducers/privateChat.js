import {
    ADD_PRIVATE_MESSAGE_LIST, FLUSH_PRIVATE_MESSAGE,
    GET_PRIVATE_MESSAGE_HISTORY_FAIL,
    GET_PRIVATE_MESSAGE_HISTORY_OK, GET_PRIVATE_MESSAGE_LIST_FAIL, GET_PRIVATE_MESSAGE_LIST_OK,
    ON_GET_PRIVATE_MESSAGE_HISTORY, ON_GET_PRIVATE_MESSAGE_LIST,
    ON_SEND_PRIVATE_MESSAGE,
} from "../common/constant/ActionTypes"

const initialState = {
    chatList: [],
    isLoading: false,
    hasLoadHistory: false,
};

const flushPrivateMessage = (messages, message) => {
    let size = messages.length;
    for(let i = size - 1; i--; i > 0) {
        if(messages[i]._id === message._id) {
            messages[i] = message;
        }
    }
    return [...messages];
};

const flushMessageList  = (state, id, snippet) => {
    let chatList = state.chatList;
    console.log(state, id, snippet);
    let list = [];
    if (!chatList && Array.isArray(chatList)) {
        for (let item of chatList) {
            if (item.id === id) {
                item.text = snippet.text;
                item.image = snippet.image;
                item.createdAt = snippet.createdAt
            }
            list.push(item)
        }
    }

    return list;
};


const privateChat = (state=initialState, action) => {
    switch (action.type) {
        case ON_SEND_PRIVATE_MESSAGE:
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    messages: state[action.id] && state[action.id].messages?
                        [...state[action.id].messages, action.message]
                        : [action.message],
                }
            };

        case ADD_PRIVATE_MESSAGE_LIST:
            return {
                ...state,
                chatList: [action.item, ...state.chatList]
            };
        case ON_GET_PRIVATE_MESSAGE_LIST:
            return {
                ...state,
                isLoading: true,
            };
        case GET_PRIVATE_MESSAGE_LIST_OK:
            return {
                ...state,
                chatList: action.list,
                isLoading: false,
            };
        case GET_PRIVATE_MESSAGE_LIST_FAIL:
            return {
                ...state,
                error: action.err,
                isLoading: false,
            };
        case ON_GET_PRIVATE_MESSAGE_HISTORY:
            return {
                ...state,
                [action.id]: {
                    isLoading: true,
                }
            };
        case GET_PRIVATE_MESSAGE_HISTORY_OK:
            return {
                ...state,
                [action.id]: {
                    isLoading: false,
                    messages: action.messages,
                    hasLoadHistory: true,
                }
            };
        case GET_PRIVATE_MESSAGE_HISTORY_FAIL:
            return {
                ...state,
                [action.id]: {
                    isLoading: false,
                    error: action.err,
                }
            };
        case FLUSH_PRIVATE_MESSAGE:
            console.log("props change",state[action.id]);
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    messages: flushPrivateMessage(state[action.id].messages, action.message),
                }
            };
        default:
            return state;
    }

};

export default privateChat;
