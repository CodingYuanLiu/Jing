import React from "react"
import { View, Text, StatusBar, StyleSheet } from 'react-native';

export default class DiscoverScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {

        return(
                <View style={styles.container}>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
