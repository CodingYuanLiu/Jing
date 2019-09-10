import axios from "axios"

const Reject = (err, reject) => {
    /* Response is Ok */
    if (err.response) {
        reject(err.response)
    } else if (err.request) {
        /* Request is being dealt with */
    } else {
        /* Respone throw error */
        throw err
    }
};
const key = "7a541426131381c7198a306b55ae4ba3";

export default  class AMapApi {
    static getInputTips = async (keywords, city) => {
        let res = await axios.get(`https://restapi.amap.com/v3/assistant/inputtips?key=${key}&keywords=${keywords}&city=${city}`);
        if (res.data.status === 0) {
            throw  new Error("service not available");
        }
        return res.data;
    };

    static reverseLocationCode = async (latitude, longitude, city) => {
        let res = await axios.get(`https://restapi.amap.com/v3/geocode/regeo?key=${key}&city=${city}`);
        if (res.data.status === 0) {
            throw new Error("service not available");
        }
        return res.data;
    };

    static getRoutes = async (origin, destination) => {
        console.log(origin, destination);
        let res = await axios.get(`https://restapi.amap.com/v3/direction/driving?origin=${origin.longitude},${origin.latitude}&destination=${destination.longitude},${destination.latitude}&extensions=all&key=${key}`);
        if (res.data.status === 0) {
            throw new Error("Service not available");
        }
        return res.data;
    };
}
