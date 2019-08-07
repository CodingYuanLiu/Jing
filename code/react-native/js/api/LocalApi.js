import Util from "../common/util";
import Dao from "./Dao";

export default class LocalApi {
    static savePublishDraft = async (item) => {
        item.saveTime = Util.dateTimeToString(new Date());
        let dataList, res;
        try {
            res = await Dao.get("@draft");
            dataList = JSON.parse(res);
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
    };
    static saveRecentScan = async (item) => {
        let recentList, res, data;
        data = {
            id: item.id,
            title: item.title,
            description: item.description,
            type: item.type,
        };
        try {
            res = await Dao.get("@recent");
            recentList = JSON.parse(res);
            let saved = false;
            for (let i of recentList) {
                if (i.id === item.id) {
                    saved = true;
                }
            }
            if (!saved) {
                recentList = [...recentList, data];
                await Dao.saveJson("@recent", recentList);
            }
        } catch (err) {
            console.log(err);
            recentList = [data];
            await Dao.saveJson("@recent", recentList)
                .catch(e => {console.log(e)})
        }
    };
    static getRecentScan = () => {
        return new Promise((resolve, reject) => {
            Dao.get("@recent")
                .then(data => {
                    resolve(JSON.parse(data));
                })
                .catch(err => {
                    reject(err);
                })
        })
    };
    static clearRecentScan = () => {
        return new Promise((resolve, reject) => {
            Dao.remove("@recent")
                .then(() => {
                    resolve({status: 1});
                })
                .catch(err => {
                    reject(err);
                })
        });
    };


    static saveSearchHistory = async (title) => {
        let history, historyList;
        try {
            history = await Dao.get("@searchHistory");
            historyList = JSON.parse(history);
            let list = [];
            let data = {
                title: title,
            };
            let saved = false;
            if (historyList.length > 0) {
                data.id = historyList[historyList.length - 1].id + 1;
            } else {
                data.id = 1;
            }
            let saveData;
            for (let i of historyList) {
                if (i.title === title) {
                    saveData = i;
                    saved = true;
                }
            }
            if (!saved) {
                list = [data, ...list]
            } else {
                list = [saveData, ...list];
            }
            await Dao.saveJson("@searchHistory", list);
        } catch (err) {
            historyList = [{id: 1, title: title}];
            await Dao.saveJson("@searchHistory", historyList)
                .catch(e => {console.log(e)})
        }
    };
    static getSearchHistory = async () => {
          let list = await Dao.get("@searchHistory");
          return list;
    };
    static removeSearchHistory = async(id) => {
        try {
            let list;
            list = await Dao.get("@searchHistory");
            let newList = [];
            for(let item of list) {
                if (item.id !== id) {
                    newList.push(item)
                }
            }
            await Dao.saveJson("@searchHistory", newList);
        } catch (e) {
            console.log(e);
        }
    };
    static clearSearchHistory = async () => {
        try {
            await Dao.remove("@searchHistory")
        } catch (e) {
            console.log(e);
        }
    };
}
