import axios from "axios";

export default  class TaobaoApi {
    static getInputTips = async (keywords) => {
        let res = await axios.get(`https://suggest.taobao.com/sug?code=utf-8&q=${keywords}&_ksTS=1566805848116_1323&callback=jsonp1324&area=ssrch&k=1`);
        if (res.status === 0) {
            throw  new Error("service not available");
        }
        return res.data;
    };


}
