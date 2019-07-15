import React from "react"
import { View, Text } from 'react-native';


export default class SystemNoticeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is 系统通知 screen!
                </Text>
            </View>
        )
    }
}

