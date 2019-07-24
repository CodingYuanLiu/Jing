import {createStackNavigator}  from "react-navigation";
import React from "react";
import ChatRoom from "./ChatRoom";
import GroupChat from "./GroupChat";


export default createStackNavigator({
    ChatRoom: {
        screen: ChatRoom,
    },
    GroupChat: {
        screen: GroupChat,
    }
},{
    navigationOptions: {
        header: null,
    }
})
