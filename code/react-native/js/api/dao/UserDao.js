import AsyncStorage from "@react-native-community/async-storage";

export default class UserDao {
    static save = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data))
        } catch (err) {
            throw new Error(err)
        }
    }

    static saveOrUpdate(key, data) {

    }

    static update(key, data) {

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
        } catch (err) {
            throw new Error(err)
        }
    }
}
