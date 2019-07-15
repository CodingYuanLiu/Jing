import React from "react"
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import NavigationUtil from '../../../navigator/NavUtil';


export default class FollowActScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Text>
                    你关注的用户和话题动态都在这里!
                </Text>
                <Button onPress={() => {NavigationUtil.toPage(this.props, "ActDetail")}} title="查看详情"/>
            </View>
        )
    }
}
