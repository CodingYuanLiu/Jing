import React from "react"
import { View, Text, StyleSheet } from 'react-native';
import { Image, Icon } from "react-native-elements";

export default class NoComment extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View style={styles.container}>
                <Icon
                    type={"material-community"}
                    name={"message-text"}
                    size={50}
                    color={"#d3d3d3"}
                />
                <Text style={styles.title}>
                    zan wu ping lun
                </Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#d3d3d3",
        marginTop: 10,
        fontSize: 32,
    },
})
