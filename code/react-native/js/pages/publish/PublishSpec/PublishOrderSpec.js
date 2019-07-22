import React from "react"
import { View, Text } from 'react-native';


export default class PublishOrderSpec extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is Order 的专门页面
                </Text>
            </View>
        )
    }
}

