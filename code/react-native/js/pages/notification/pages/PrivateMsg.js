import React from "react"
import { View, Text } from 'react-native';
import NoticeHeader from '../components/NoticeHeader';
import {Button} from "react-native-elements";
import NavigationUtil from "../../../navigator/NavUtil";

export default class PrivateMsgScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <NoticeHeader
                    title="私信列表"
                    onPress={() => {alert("clear")}}
                />
                <Button
                    title={"私信"}
                    type={"clear"}
                    onPress={() => {
                        NavigationUtil.toPage({
                            receiver: {
                                _id: "11",
                                avatar: "http://image.jing855.cn/FsNTBAJkBVOvZ-6kLJWgQR8pbRFQ",
                                nickname: "可可爱爱的昵称",
                            }
                        }, "PrivateChat")
                    }}
                />
            </View>
        )
    }
}

