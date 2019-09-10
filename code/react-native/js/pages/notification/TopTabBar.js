import React from "react";
import SystemNotice from './pages/SystemNotice';
import PrivateMsg from './pages/PrivateMsg';
import GroupChat from './pages/GroupChat';
import Util from "../../common/util";

const window = Util.getVerticalWindowDimension();
const NoticeTopTab = {
    SystemNotice: {
        screen: SystemNotice,
        navigationOptions: {
            title: "通知",
        }
    },
    PrivateMsg: {
        screen: PrivateMsg,
        navigationOptions: {
            title: "私信",
        }
    },
    GroupChat: {
        screen: GroupChat,
        navigationOptions: {
            title: "聊天"
        }
    },
};
const NoticeTabConfig = {
    tabBarOptions: {
        style: {
            backgroundColor: "#0084ff",
            height: 50,
            borderTop: 0
        },
        tabStyle: {
            height: 50,
        },
        indicatorStyle: {
            backgroundColor: "#fff",
            width: 60,
            marginLeft: ( window.width / 3 - 60 ) / 2,
        },
        labelStyle: {
          fontSize: 16
        },
        lazy: false,
    }
}



export {
    NoticeTopTab,
    NoticeTabConfig,
}
