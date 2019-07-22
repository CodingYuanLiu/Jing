import React from "react"
import { View, Text } from 'react-native';
import NoticeHeader from '../components/NoticeHeader';
import NavigationUtil from "../../../navigator/NavUtil";
import {Button} from "react-native-elements";

export default class GroupChatScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <NoticeHeader
                    title="群聊列表"
                    onPress={() => {alert("clear")}}
                />
                <Button
                    title={"去另一个聊天测试"}
                    onPress={() => {NavigationUtil.toPage(null, "AnotherTest")}}
                />
            </View>
        )
    }
}

