import React from "react"
import { View, Text, StyleSheet } from 'react-native';


export default class PersonalJoin extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <Text>参与的活动列表</Text>
            </View>
        )
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 200,
    },
});
