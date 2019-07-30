import AsyncStorage from "@react-native-community/async-storage";

export default class Dao {
    static saveJson = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
            return data
        } catch (err) {
            err.status = 500;
            throw new Error(err)
        }
    };

    static saveString = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data);
            return data
        } catch (err) {
            err.status = 500;
            throw new Error(err)
        }
    };


    static get = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                return value
            } else {
                let err = new Error("not found");
                err.status = 404;
                throw err;
            }
        } catch (err) {
            err.status = 500;
            throw new Error(err)
        }
    };

    static remove = async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            return
        } catch (err) {
            err.status = 500;
            err.message = "delete fail";
            throw new Error(err)
        }
    }
}




