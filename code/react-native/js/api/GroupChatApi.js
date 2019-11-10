import axios from "axios";
const RNFS = require("react-native-fs");
const BASIC_URI = "http://39.105.54.161:8080";
export default class GroupChatApi {

    static uploadImages = async (image) => {
        try {
            let imageDataList;
            if(image !== null && image !== undefined) {
                let list = [];
                for(let item of image) {
                    list.push(await RNFS.readFile(item, "base64"));
                }
                imageDataList = list;
            }
            let res = await axios.post(`${BASIC_URI}/images/multiple`, {
                image: imageDataList,
            });

            console.log(res);
            return res.data;
        } catch (e) {
            console.log(e);
            return [];
        }
    };
}
