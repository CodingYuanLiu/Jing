import Util from "../common/util";
import Dao from "./Dao";

export default class LocalApi {
    static savePublishDraft = async (item) => {
        item.saveTime = Util.dateTimeToString(new Date());
        let dataList, res;
        try {
            res = await Dao.get("@draft");
            console.log("res", res);
            dataList = JSON.parse(res);
            console.log("data", dataList);
            console.log(item);
            if (dataList.length > 0) {
                item.id = dataList[dataList.length - 1].id + 1;
            } else {
                item.id = 1;
            }
            dataList = [...dataList, item];
            await Dao.saveJson("@draft", dataList);
        } catch (err) {
            console.log(err);
            item.id = 1;
            dataList = [item];
            await Dao.saveJson("@draft", dataList)
                .catch(e => {console.log(e)})
        }
    };

    static getPublishDraft = () => {
        return new Promise((resolve, reject) => {
            Dao.get("@draft")
                .then(res => {
                    resolve(JSON.parse(res));
                })
                .catch(err => {
                    reject(err);
                })
        })
    };

    static removePublishDraft = (list, id) => {
        return new Promise((resolve, reject) => {
            let drafts = new Array();
            for (let item of list) {
                if (item.id !== id){
                    drafts.push(item);
                }
            }
            Dao.saveJson("@draft", drafts)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}
