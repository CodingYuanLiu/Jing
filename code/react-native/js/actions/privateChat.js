import {
    GET_PRIVATE_MESSAGE_LIST_OK,
    ON_GET_PRIVATE_MESSAGE_HISTORY,
    ON_GET_PRIVATE_MESSAGE_LIST
} from "../common/constant/ActionTypes";
import {PrivateMessageApi} from "../api/XmppApi";

const getPrivateChatList = (jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_PRIVATE_MESSAGE_LIST,
        });
        PrivateMessageApi.getChatList(jwt)
            .then(data => {
                dispatch({
                    type: GET_PRIVATE_MESSAGE_LIST_OK,
                    data,
                });
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
    }
};

const getChatHistory = (senderId, jwt) => {
    return dispatch => {
        dispatch({
            type: ON_GET_PRIVATE_MESSAGE_HISTORY,
        });
        PrivateMessageApi.getChatHistory(senderId, jwt)
            .then(res => {
                let currentUser;
                if (res.user1.id === senderId) {
                    currentUser = res.user2;
                } else {
                    currentUser = res.user1;
                }
                let list = [];
                for (let item of res.data) {
                    let newItem = {};
                    newItem.id = item.id;
                    newItem.createdAt = item.createdAt;
                    newItem.text = item.text;
                    if (item.image) newItem.image = item.image;

                    if (currentUser === res.user1) {
                        newItem.user = res.user1;
                    } else {
                        newItem.user = res.user2;
                    }

                    if(currentUser === res.user1 && !item.isUser1Deleted || currentUser === res.user2 && !item.isUser2Deleted) {
                        list.push(newItem);
                    }
                }
                console.log(list);
            })
            .catch(err => {
                console.log(err);
            })
    };
};

export {
    getPrivateChatList,
}
