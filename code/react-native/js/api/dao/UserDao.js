import AsyncStorage from "@react-native-community/async-storage";

export default class UserDao {
    static saveJson = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data))
            return
        } catch (err) {
            throw new Error(err)
        }
    }

    static saveString = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, data)
            return
        } catch (err) {
            throw new Error(err)
        }
    }


    static get = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (value !== null) {
                return value
            } else throw new Error("Fetch null value")
        } catch (err) {
            throw new Error(err)
        }
    }

    static remove = async (key) => {
        try {
            await AsyncStorage.removeItem(key)
            return
        } catch (err) {
            throw new Error(err)
        }
    }
}
