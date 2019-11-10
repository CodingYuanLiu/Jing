import {
    FLUSH_GROUP_CHAT_MESSAGE,
    ON_SEND_GROUP_CHAT_MESSAGE, TOGGLE_HAS_PRESENCE
} from "../common/constant/ActionTypes";

const addGroupChatMessage = (message, id) => ({
    type: ON_SEND_GROUP_CHAT_MESSAGE,
    id,
    message,
});


const toggleHasPresence = (id) => {
    return dispatch => {
        dispatch({
            type: TOGGLE_HAS_PRESENCE,
        })
    }
};

const flushGroupChatMessage = (id, message) => ({
    type: FLUSH_GROUP_CHAT_MESSAGE,
    id,
    message,
});

export {
    toggleHasPresence,
    addGroupChatMessage,
    flushGroupChatMessage,
}
