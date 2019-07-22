
export default class Util {
    static dateTimeToString = date => {
        let dateString = date.toISOString();
        dateString = dateString.substring(0, dateString.indexOf("T"));

        let timeString = date.toLocaleTimeString();
        timeString = timeString.substring(0, timeString.indexOf(" "));
        let res=`${dateString} ${timeString}`
        return res;
    }

}
