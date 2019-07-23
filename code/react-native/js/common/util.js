import React from "react";
import {Dimensions} from "react-native";

export default class Util {
    static dateTimeToString = date => {
        let dateString = date.toISOString();
        dateString = dateString.substring(0, dateString.indexOf("T"));

        let timeString = date.toTimeString();
        timeString = timeString.substring(0, timeString.indexOf(" "));
        let res=`${dateString} ${timeString}`

        return res;

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
    }
}
