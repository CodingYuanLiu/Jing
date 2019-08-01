import React from "react"
import { View, Text, StyleSheet } from 'react-native';


export default class PersonalFeedback extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <Text>其他用户对该用户的评价</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        minHeight: 200,
        flex: 1,
    },

});
