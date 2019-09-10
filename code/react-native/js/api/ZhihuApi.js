import axios from "axios";

export default  class ZhihuApi {
    static getInputTips = async (keywords) => {
        let res = await axios.get(`https://www.zhihu.com/topic/autocomplete?token=${keywords}&max_matches=15`);
        if (res.status === 0) {
            throw  new Error("service not available");
        }
        return res.data;
    };


}
