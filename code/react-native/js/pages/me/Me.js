import React from "react"
import { View, Text } from 'react-native';
import {Button} from 'react-native-elements';
import NavigationUtil from '../../navigator/NavUtil';

export default class MeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    This is Me!
                </Text>
                <Button title={"设置"} onPress={() => {NavigationUtil.toPage(this.props, "Setting")}} />

                <Button title={"登录"} onPress={() => {NavigationUtil.toPage(this.props, "Login")}}/>
            </View>
        )
    }
}

