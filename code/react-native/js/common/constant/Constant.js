export default {
    DEFAULT_SIGNATURE: "这里一无所有，直到遇见你",
    DEFAULT_AVATAR: "http://image.jing855.cn/defaultAvatar.png",
    USERBAR_HEIGHT: 30,
    DEFAULT_AVATAR_SIZE: 50,
    SEARCHBAR_HEIGHT: 32,
    UNKNOWN_ERROR_MESSAGE: "似乎出了点问题",
    LOGIN_ERROR: "登录失败，用户名或密码错误",

    DORMITORIES: [
        "东1","东2","东3","东4","东5","东6","东7","东8","东9","东10",
        "东11","东12","东13","东14","东15","东16","东17","东18","东19","东20",
        "东21","东22","东23","东24","东25","东26","东27","东28","东29","东30",
    ],

    MAJORS: [
        "安泰经济与管理学院", "电子信息与电气工程学院", "机械动力工程学院", "船舶建设与海洋工程学院"
    ],
}
const ACT_FULL = 1;
const ACT_RUNNING = 0;
const ACT_FORBIDDEN = -1;
const ACT_EXPIRED = 2;
const HAVE_FEEDBACK = 1;
const NO_FEEDBACK = 0;
const ACT_TYPE_TAXI = "taxi";
const ACT_TYPE_TAKEOUT = "takeout";
const ACT_TYPE_ORDER = "order";
const ACT_TYPE_OTHER = "other";

export {
    /**
     * activity constants
     */
    // activity status
    ACT_FULL,
    ACT_EXPIRED,
    ACT_FORBIDDEN,
    ACT_RUNNING,

    // activity type
    ACT_TYPE_TAXI,
    ACT_TYPE_TAKEOUT,
    ACT_TYPE_ORDER,
    ACT_TYPE_OTHER,

    // feedback status
    HAVE_FEEDBACK,
    NO_FEEDBACK,
}
