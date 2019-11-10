import Util from "../common/util";
import Dao from "./Dao";
import awaitAsyncGenerator from "@babel/runtime/helpers/esm/awaitAsyncGenerator";
import groupChat from "../reducers/groupChat";

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
                data.id = historyList[0].id + 1;
            } else {
                data.id = 1;
            }
            for (let i of historyList) {
                if (i.title === title) {
                    saved = true;
                } else {
                    list.push(i);
                }
            }
            if (!saved) {
                list = [data, ...historyList]
            } else {
                list = [data, ...list];
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
          return JSON.parse(list);
    };
    static removeSearchHistory = async(id) => {
        try {
            let list, res;
            res = await Dao.get("@searchHistory");
            list = JSON.parse(res);
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
            await Dao.remove("@searchHistory");
        } catch (e) {
            console.log(e);
        }
    };

    // setting api
    static getWaterMarkSetting = async () => {
        let waterMarkSetting = await Dao.get("@settingWaterMark");
        return waterMarkSetting !== '0';
    };
    static saveWaterMarkSetting = async (flag) => {
        try {
            await Dao.saveString("@settingWaterMark", flag ? '1' : '0');
        } catch (e) {
            console.log(e);
        }
    };
    static getFindByPhoneSetting = async () => {
        let findByPhoneSetting = await Dao.get("@settingFindByPhone");
        return findByPhoneSetting !== '0';
    };
    static saveFindByPhoneSetting = async (flag) => {
        try {
            await Dao.saveString("@settingFindByPhone", flag ? '1' : '0');
        } catch (e) {
            console.log(e);
        }
    };
    static getSaveDataSetting = async () => {
        let saveDataSetting = await Dao.get("@settingSaveData");
        return saveDataSetting !== '0';
    };
    static saveSaveDataSetting = async (flag) => {
        try {
            await Dao.saveString("@settingSaveData",flag ? '1' : '0');
        } catch (e) {
            console.log(e);
        }
    };

    static getFirstLogin = async () => {
        try{
            let res = await Dao.get("@isFirstLogin");
            return res === "true";
        } catch (e) {
            return true;
        }
    };
    static saveFirstLogin = async (flag) => {
        try {
            await Dao.saveString("@isFirstLogin",flag.toString());
        } catch (e) {
            console.log(e);
        }
    };

    static getToken = async () => {
        try {
            return await Dao.get("@jwt");
        } catch (e) {
            console.log(e);
        }
    };

    static saveToken = async (token) => {
        try {
            await Dao.saveString("@jwt", token);
        }catch (e) {
            console.log(e);
        }
    };

    static removeToken = async () => {
        try {
            await Dao.remove("@jwt");
        }catch (e) {
            console.log(e);
        }
    };

    static getGroupChatHistory = async (id) => {
        try {
            let res = JSON.parse( await Dao.get("@groupChatHistory") );
            for (let item of res[id].messages) {
                item.pending = false;
            }
            return res[id];
        } catch (e) {
            console.log(e);
            return {
                messages: [],
                total: 0,
            };
        }
    };

    static saveGroupChatMessage = async (id, message) => {
        try{
            let history;
            try {
                let res = await Dao.get("@groupChatHistory");
                history = JSON.parse(res);
            } catch (e) {
                history = {};
            }

            let chat = history[id];
            if(!chat) {
                chat = {
                    messages: [],
                    total: 0,
                };
                history[id] = chat;
            }
            chat.messages.push(message);
            chat.total++;
            console.log("history", chat);
            await Dao.saveJson("@groupChatHistory", history);
        }catch (e) {
            console.log(e)
        }
    };

    static removeHistory = async (id) => {
        try {
            let history = JSON.parse(await Dao.get("groupChatHistory"));
            history[id] = null;
            await Dao.saveJson("@groupChatHistory", history);
        }catch (e) {
            console.log(e);
        }
    }
}
