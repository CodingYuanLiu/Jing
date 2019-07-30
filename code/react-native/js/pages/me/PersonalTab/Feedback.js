import React from "react"
import { View, Text } from 'react-native';


export default class PersonalFeedback extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>其他用户对该用户的评价</Text>
            </View>
        )
    }
}
