import React from "react"
import { View, Text, StyleSheet, } from 'react-native';


export default class PersonalTrack extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <Text>个人的动态</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 200,
    },
});
