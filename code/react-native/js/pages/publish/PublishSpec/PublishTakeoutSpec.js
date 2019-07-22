import React from "react"
import { View, Text } from 'react-native';


export default class PublishTakeoutSpec extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is takeout 的专门页面
                </Text>
            </View>
        )
    }
}

