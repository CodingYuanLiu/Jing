import React from "react"
import { View, Text, StatusBar } from 'react-native';
import { Button } from 'react-native-elements';

export default class DiscoverScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>

                <View>
                    <Text>
                        这里是主页面
                    </Text>
                </View>
            </View>
        )
    }
}

