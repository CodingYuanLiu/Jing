import React from "react"
import { View, Text } from 'react-native';


export default class SearchScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is Search screen!
                </Text>
            </View>
        )
    }
}

