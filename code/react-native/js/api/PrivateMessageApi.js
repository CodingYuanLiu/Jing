import axios from "axios";
const RNFS = require("react-native-fs");

const PRIVATE_MESSAGE_BASIC_URI = "http://39.105.54.161:8080";

export class PrivateMessageApi {
    static getChatList = async (jwt) => {
        let res = await axios.get(`${PRIVATE_MESSAGE_BASIC_URI}/chat/list`, {
            headers: {
                "Authorization": jwt,
            }
        });
        console.log(res.data);
        return res.data;
    };
    static getChatHistory = async (senderId, jwt) => {
        let res = await axios.get(`${PRIVATE_MESSAGE_BASIC_URI}/chat?sender_id=${senderId}`, {
            headers: {
                "Authorization": jwt,
            }
        });
        console.log(res);
        return res.data;

    };
    static addMessage = async (message, jwt) => {

        if(message.image !== null && message.image !== undefined && message.isSelf) {
            let list = [];
            for(let item of message.image) {
                list.push(await RNFS.readFile(item, "base64"));
            }
            message.image = list;
        }

        let res = await axios.post(`${PRIVATE_MESSAGE_BASIC_URI}/chat`, message, {
            headers: {
                "Authorization": jwt,
            }
        });
        console.log(res);
        return res.data;
    };
}
