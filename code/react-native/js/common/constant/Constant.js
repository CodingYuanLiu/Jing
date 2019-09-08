import Util from "../util";

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

const WINDOW = Util.getVerticalWindowDimension();
const DORMITORIES = [
    "东1","东2","东3","东4","东5","东6","东7","东8","东9","东10",
    "东11","东12","东13","东14","东15","东16","东17","东18","东19","东20",
    "东21","东22","东23","东24","东25","东26","东27","东28","东29","东30",
];

const MAJORS = [
    {
        id: '000',
        title: '人文学院',
        data: [
            {
                id: '000001',
                title: '汉语言(语言文化方向)'
            },
            {
                id: '000002',
                title: '汉语言(商务汉语方向)'
            },
            {
                id: '000003',
                title: '汉语言(金融汉语方向)'
            },
            {
                id: '000004',
                title: '汉语言文学'
            },
            {
                id: '000005',
                title: '汉语言(二年级插班)'
            },
            {
                id: '000006',
                title: '汉语言(国际中英双语方向)'
            },
        ]
    },
    {
        id: '001',
        title: "电气工程与电子信息学院",
        data: [
            {
                id: '001001',
                title: "电子信息类(软件工程)",
            },
            {
                id: '001002',
                title: "电子信息类(计算机科学与技术)"
            },
            {
                id: '001003',
                title: "电子信息类(信息工程)",
            },
            {
                id: '001004',
                title: "电子信息类(电气工程与自动化)",
            },
            {
                id: '001005',
                title: "电子信息类(微电子科学与工程)",
            },
            {
                id: '001006',
                title: "电子信息类(自动化)",
            },
            {
                id: '001007',
                title: "电子信息类(测控技术与仪器)",
            },
            {
                id: '001008',
                title: "电子信息类(电子科学与技术)",
            }
        ]
    },
    {
        id: '002',
        title: '安泰经济与管理学院',
        data: [
            {
                id: '002001',
                title: '经济学类(经济学)',
            },
            {
                id: '002002',
                title: '经济学类(国际经济与贸易)',
            },
            {
                id: '002003',
                title: '经济学类(金融学)',
            },
            {
                id: '002004',
                title: '工商管理类(工商管理)',
            },
            {
                id: '002005',
                title: '工商管理类(会计学)',
            },
        ],
    },
    {
        id: '003',
        title: '国际与公共事务学院',
        data: [
            {
                id: '003001',
                title: '公共管理类(行政管理)'
            },
        ]
    },
    {
        id: '004',
        title: '媒体与设计学院',
        data: [
            {
                id: '004001',
                title: '传播学'
            },
            {
                id: '004002',
                title: '广播电视编导'
            },
            {
                id: '004003',
                title: '公共事业管理(文化艺术管理)'
            },
            {
                id: '004004',
                title: '视觉传达设计'
            },
            {
                id: '004005',
                title: '工业设计'
            },
        ]
    },
    {
        id: '005',
        title: '外国语学院',
        data: [
            {
                id: '005001',
                title: '英语'
            },
            {
                id: '005002',
                title: '日语'
            },
            {
                id: '005003',
                title: '德语'
            },
        ]
    },
    {
        id: '007',
        title: '凯原法学院',
        data: [
            {
                id: '007001',
                title: '法学'
            },
        ]
    },
    {
        id: '008',
        title: '船舶海洋与建筑工程学院',
        data: [
            {
                id: '008001',
                title: '海洋工程类(船舶与海洋工程)'
            },
            {
                id: '008002',
                title: '土木类(交通运输)'
            },
            {
                id: '008003',
                title: '土木类(土木工程)',
            },
            {
                id: '008004',
                title: '土木类(工程力学)',
            },
            {
                id: '008005',
                title: '建筑学(五年制)',
            },
        ]
    },
    {
        id: '009',
        title: '机械与动力工程学院',
        data: [
            {
                id: '009001',
                title: '机械类(机械工程)',
            },
            {
                id: '009002',
                title: '机械类(工业工程)',
            },
            {
                id: '009003',
                title: '机械类(能源与动力工程)',
            },
            {
                id: '009004',
                title: '机械类(新能源科学与工程)',
            },
        ]
    },
    {
        id: '010',
        title: '材料科学与工程学院',
        data: [
            {
                id: '010001',
                title: '材料科学与工程',
            },
        ]
    },
    {
        id: '011',
        title: '数学系',
        data: [
            {
                id: '011001',
                title: '数学与应用数学',
            },
        ]
    },
    {
        id: '012',
        title: '物理与天文系',
        data: [
            {
                id: '012001',
                title: '物理学类(物理学)',
            },
            {
                id: '012002',
                title: '物理学类(应用物理学)',
            },
        ]
    },
    {
        id: '013',
        title: '化学化工学院',
        data: [
            {
                id: '013001',
                title: '化学类(应用化学)',
            },
            {
                id: '013002',
                title: '化学类(化学工程与工艺)',
            },
        ]
    },
    {
        id: '014',
        title: '生命科学技术学院',
        data: [
            {
                id: '014001',
                title: '生物技术类(生物技术)',
            },
            {
                id: '014002',
                title: '生物技术类(生物工程)',
            },
        ]
    },
    {
        id: '015',
        title: '生物医学工程学院',
        data: [
            {
                id: '015001',
                title: '生物医学工程',
            },
        ]
    },
    {
        id: '016',
        title: '农业与生物学院',
        data: [
            {
                id: '016001',
                title: '自然保护与环境生态类(资源环境科学)',
            },
            {
                id: '016002',
                title: '自然保护与环境生态类(动物科学)',
            },
            {
                id: '016003',
                title: '自然保护与环境生态类(植物科学与技术)',
            },
        ]
    },
    {
        id: '017',
        title: '药学院',
        data: [
            {
                id: '017001',
                title: '药学',
            },
        ]
    },
    {
        id: '018',
        title: '环境科学与工程学院',
        data: [
            {
                id: '018001',
                title: '环境科学与工程',
            },
        ]
    },
    {
        id: '019',
        title: '航空航天学院',
        data: [
            {
                id: '019001',
                title: '航空航天工程',
            },
        ]
    },
    {
        id: '020',
        title: '医学院',
        data: [
            {
                id: '020001',
                title: '临床医学(5 年)',
            },
            {
                id: '020002',
                title: '口腔医学(5 年)',
            },
        ]
    },
    {
        id: '021',
        title: '密西根学院(英语授课)',
        data: [
            {
                id: '021001',
                title: '机械工程',
            },
            {
                id: '021002',
                title: '电子与计算机工程',
            },
        ]
    },
    {
        id: '022',
        title: '巴黎高科卓越工程师学院 (法语授课)',
        data: [
            {
                id: '022001',
                title: '机械工程',
            },
            {
                id: '022002',
                title: '信息工程',
            },
            {
                id: '022003',
                title: '能源与动力工程',
            },
        ]
    },
];

const GENDER_MALE = 1;
const GENDER_FEMALE = 0;
const GENDER_SECRET = 2;

const JOINING = -1;
const JOINED = 0;
const NOT_JOIN = -2;
const IS_SPONSOR = 1;
const REJECTED = -3;


const PRESENCE = {
    BUSY: "忙碌",
    ONLINE: "在线",
    LEAVE: "离开",
};

const LOGIN_STATUS = {
    OFFLINE: -2,
    WAITING: -1,
    LOGGED: 0,
    FIRST_LOGIN: 1,
    USERNAME_EMPTY: 2,
    NEW_USER_IN_APP: 12,
};
const CHAT_TYPE = {
    GROUP_CHAT: "groupchat",
    PRIVATE_CHAT: "chat",
};

const PUBLISH_ACTION = {
    PUBLISH: "publish",
    MODIFY: "modify",
};
const DEFAULT_IMAGE = "http://pxafsavqu.bkt.clouddn.com/empty_image.png";
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

    WINDOW,
    DORMITORIES,
    MAJORS,

    GENDER_FEMALE,
    GENDER_MALE,
    GENDER_SECRET,

    JOINING,
    JOINED,
    NOT_JOIN,
    IS_SPONSOR,
    REJECTED,

    LOGIN_STATUS,

    CHAT_TYPE,

    PRESENCE,
    DEFAULT_IMAGE,
    PUBLISH_ACTION,
}
