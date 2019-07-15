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
                    这里是根据时间、你参加活动的类别、你关注的活动类型给你的推荐!
                </Text>
                <Button onPress={() => {console.log(NavigationUtil.Navigation); NavigationUtil.toPage(this.props, "ActDetail")}} title="查看详情"/>
            </View>
        )
    }
}
