import React from "react"
import { View, Text } from 'react-native';


export default class PersonalPublish extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>发布的活动列表</Text>
            </View>
        )
    }
}
