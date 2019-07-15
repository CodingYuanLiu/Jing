import React from "react"
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';

export default class DiscoverScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>
                <Button title={"顶部"}></Button>
                <Text>
                    This is discover!
                </Text>
            </View>
        )
    }
}

