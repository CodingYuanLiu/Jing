import React from "react"
import { View, Text } from 'react-native';


export default class PersonalTrack extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>个人的动态</Text>
            </View>
        )
    }
}
