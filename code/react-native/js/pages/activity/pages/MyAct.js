import React from "react"
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import NavigationUtil from '../../../navigator/NavUtil';


export default class HomeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    你参加过/正在参加的活动都在这里!
                </Text>
                <Button onPress={() => {NavigationUtil.toPage(this.props, "ActDetail")}} title="查看详情"/>
            </View>
        )
    }
}
