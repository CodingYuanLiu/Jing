import React from "react";
import {Dimensions} from "react-native";
import CryptoJs from "crypto-js";

export default class Util {
    static dateTimeToString = date => {
        let dateString = date.toISOString();
        dateString = dateString.substring(0, dateString.indexOf("T"));

        let timeString = date.toTimeString();
        timeString = timeString.substring(0, timeString.indexOf(" "));
        return `${dateString} ${timeString}`;
    };

    static dateTimeToDisplayString = date => {
        /**
         * 1s - 59s - 刚刚
         * 1min - 59min - ${minutes}前
         * 1h - 23h - ${hour}前
         * 1天 - 29天 ${date}前
         * 30天之后 ${month}前
         * 1年之后　${year}前
         */
        if (typeof date === "string") date = new Date(date);
        let now = new Date();
        let yearDifference = now.getUTCFullYear() - date.getUTCFullYear();
        let monthDifference = now.getUTCMonth() - date.getUTCMonth();
        let dateDifference = now.getUTCDate() - date.getUTCDate();
        let hourDifference = now.getUTCHours() - date.getUTCHours();
        let minuteDifference = now.getUTCMinutes() - date.getUTCMinutes();
        let secondsDifference = now.getUTCSeconds() - date.getUTCSeconds();
        if (yearDifference > 0)
            return `${yearDifference}年前`;
        else if (monthDifference > 0)
            return `${monthDifference}个月前`;
        else if (dateDifference > 0)
            return `${dateDifference}天前`;
        else if (hourDifference > 0)
            return `${hourDifference}小时前`;
        else if (minuteDifference > 0)
            return `${minuteDifference}分钟前`;
        else if (secondsDifference > 0)
            return "刚刚";
        else return "刚刚";
    };

    static getVerticalWindowDimension = () => {
        let {height, width} = Dimensions.get("window");
        if (height < width) {
            let tmp = width;
            width = height;
            height = tmp;
        }
        return {
            height: height,
            width: width,
        }
    };
    static cryptoOnpenFire(username, password) {
        let crypt = CryptoJs.MD5(username+password).toString();
        return crypt.substring(5, 15);
    };

    static actStatusToText = (status) => {
        return "等待加入"
    };
}
