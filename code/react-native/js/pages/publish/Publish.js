import React from "react"
import { View, Text } from 'react-native';


export default class PublishScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is publish!
                </Text>
            </View>
        )
    }
}

