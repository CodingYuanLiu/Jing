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

    static SKIP_LOGIN = false;

    static distanceToDisplayString = (distance) => {
        if (distance > 1000) {
            return `${Number(distance / 1000).toFixed(2)}km`
        } else return `${distance}m`;
    };

    static durationToDisplayString = (seconds) => {
        let days = 0, hours = 0, minutes = 0;
        if (seconds > 3600 * 24) {
            days = Number(seconds / 3600 / 24).toFixed();
        }
        seconds -= days * 3600 * 24;
        if (seconds > 3600) {
            hours = (seconds / 3600).toFixed();
        }
        seconds -= hours * 3600;
        if (seconds > 60) {
            minutes = (seconds / 60).toFixed();
        }

        let res = "";
        if (days > 0) res = `${days}天`;
        if (hours > 0) {
            res = `${res}${hours}小时`
        } else if (days > 0) {
            return res;
        } else {
            return `${res}${minutes}分钟`;
        }
    };
}
