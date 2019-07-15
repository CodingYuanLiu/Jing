import React from "react"
import { View, Text } from 'react-native';


export default class GroupChatScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is 群聊通知 screen!
                </Text>
            </View>
        )
    }
}

