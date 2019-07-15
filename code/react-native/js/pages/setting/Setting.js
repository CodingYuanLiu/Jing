import React from "react"
import { View, Text } from 'react-native';


export default class SettingScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is Setting!
                </Text>
            </View>
        )
    }
}

