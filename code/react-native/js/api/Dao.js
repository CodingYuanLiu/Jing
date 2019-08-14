import AsyncStorage from "@react-native-community/async-storage";

export default class Dao {
    static saveJson = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
            return data
        } catch (err) {
            throw new Error(err)
        }
    };

    static saveString = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data);
            return data
        } catch (err) {
            throw new Error(err)
        }
    };


    static get = async (key) => {
        let res = await AsyncStorage.getItem(key);
        if (!res) {
            throw new Error("Null value of, " + key);
        } else {
            return res;
        }
    };

    static remove = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (err) {
            err.message = "delete fail";
            throw new Error(err)
        }
    }
}




