import React from "react";
import {View, Text, StyleSheet} from "react-native";
import NavigationUtil from '../../navigator/NavUtil';


export default class Start extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            NavigationUtil.toHomePage(this.props)
        }, 200)
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>欢迎使用即应</Text>
            </View>
        )
    }
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        height: 50,
    }
})
