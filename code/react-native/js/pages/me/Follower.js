import React from "react"
import { View, Text, StyleSheet } from 'react-native';

export default class Follower extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={{flex:1}}>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
