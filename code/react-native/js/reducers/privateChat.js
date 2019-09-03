import {
    ADD_PRIVATE_MESSAGE_LIST,
    GET_PRIVATE_MESSAGE_HISTORY_FAIL,
    GET_PRIVATE_MESSAGE_HISTORY_OK, GET_PRIVATE_MESSAGE_LIST_FAIL, GET_PRIVATE_MESSAGE_LIST_OK,
    ON_GET_PRIVATE_MESSAGE_HISTORY, ON_GET_PRIVATE_MESSAGE_LIST,
    ON_SEND_PRIVATE_MESSAGE,
} from "../common/constant/ActionTypes"

const initialState = {
    chatList: [],
    isLoading: false,
};

const privateChat = (state=initialState, action) => {
    switch (action.type) {
        case ON_SEND_PRIVATE_MESSAGE:
            return {
                ...state,
                [action.item]: {
                    ...state[action.item],
                    data: state[action.item] && state[action.item].data?
                        [action.message, ...state[action.item].data]
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
                chatList: action.data,
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
                [action.item]: {
                    isLoading: true,
                }
            };
        case GET_PRIVATE_MESSAGE_HISTORY_OK:
            return {
                ...state,
                [action.item]: {
                    isLoading: false,
                    data: state[action.item].data,
                }
            };
        case GET_PRIVATE_MESSAGE_HISTORY_FAIL:
            return {
                ...state,
                [action.item]: {
                    isLoading: false,
                    error: action.err,
                }
            };
        default:
            return state;
    }

};

export default privateChat;
