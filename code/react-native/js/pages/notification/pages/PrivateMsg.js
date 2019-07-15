import React from "react"
import { View, Text } from 'react-native';


export default class PrivateMsgScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is 私信!
                </Text>
            </View>
        )
    }
}

