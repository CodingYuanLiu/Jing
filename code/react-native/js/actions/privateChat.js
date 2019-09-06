import {
    FLUSH_PRIVATE_MESSAGE,
    GET_PRIVATE_MESSAGE_HISTORY_OK,
    GET_PRIVATE_MESSAGE_LIST_OK,
    ON_GET_PRIVATE_MESSAGE_HISTORY,
    ON_GET_PRIVATE_MESSAGE_LIST, ON_SEND_PRIVATE_MESSAGE
} from "../common/constant/ActionTypes";
import {PrivateMessageApi} from "../api/PrivateMessageApi";

const getPrivateChatList = (jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_PRIVATE_MESSAGE_LIST,
        });
        PrivateMessageApi.getChatList(jwt)
            .then(data => {
                dispatch({
                    type: GET_PRIVATE_MESSAGE_LIST_OK,
                    list: data,
                });
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
    }
};

const getPrivateChatHistory = (senderId, jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_PRIVATE_MESSAGE_HISTORY,
        });
        PrivateMessageApi.getChatHistory(senderId, jwt)
            .then(res => {
                console.log(res);
                let list = [];
                for (let item of res.data) {
                    if (item.isSelf && !item.isDeleted) {
                        let {id: _id, nickname: name, avatar} = res.thisUser;
                        item.user = {
                            _id,
                            name,
                            avatar,
                        };
                        item._id = item.id;
                        list.push(item);
                    } else if (!item.isSelf && !item.isDeleted) {
                        let {id: _id, nickname: name, avatar} = res.thatUser;
                        item.user = {
                            _id,
                            name,
                            avatar,
                        };
                        item._id = item.id;
                        list.push(item);
                    }
                }
                console.log(list);
                dispatch({
                    type: GET_PRIVATE_MESSAGE_HISTORY_OK,
                    messages: list,
                    id: senderId,
                })
            })
            .catch(err => {
                console.log(err);
            })
    };
};

const addPrivateMessage = (id, message) => ({
    type: ON_SEND_PRIVATE_MESSAGE,
    id,
    message,
});

const forceFlushPrivateMessage = (id, message) => ({
    type: FLUSH_PRIVATE_MESSAGE,
    id,
    message,
});
export {
    getPrivateChatList,
    getPrivateChatHistory,
    addPrivateMessage,
    forceFlushPrivateMessage,
}
