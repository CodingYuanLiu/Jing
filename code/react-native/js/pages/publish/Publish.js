import React from "react"
import {View, Text, StyleSheet, StatusBar } from 'react-native';
import { Icon } from "react-native-elements";
import NavigationUtil from '../../navigator/NavUtil';
import {connect} from "react-redux";

class PublishScreen extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    fadeOut = () => {
        StatusBar.setHidden(false, "fade")
        NavigationUtil.back(this.props)
    }
    toTable = () => {
        if (this.props.logged) {
            console.log("pressing!")
            NavigationUtil.toPage(this.props, "FillTable");
        } else {
            alert("Need login")}
        }
    render() {
        const taxi =
            <Icon
            reverse
            type={"font-awesome"}
            name={"taxi"}
            color={"#0072ff"}
            onPress={() => {this.toTable()}}
            />;
        const taxiTitle = "发起拼车"
        const shopping =
            <Icon
                 reverse
                 type={"font-awesome"}
                 name={"shopping-bag"}
                 color={"#007bff"}
                 onPress={() => {this.toTable()}}
            />;
        const shoppingTitle = "拼网购"
        const takeOut =
            <Icon
                reverse
                type={"material-community"}
                name={"food"}
                color={"#0090ff"}
                onPress={() => {this.toTable()}}
            />;
        const takeOutTitle = "拼外卖"
        const activity =
            <Icon
                reverse
                type={"ionicon"}
                name={"md-contacts"}
                color={"#009eff"}
                onPress={() => {this.toTable()}}
            />;
        const activityTitle = "发起活动"
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon
                    type={"simple-line-icon"}
                    name={"arrow-down"}
                    size={32}
                    color={"#d3d3d3"}
                    onPress={this.fadeOut}
                    />
                </View>
                <View style={styles.main}>
                    <View style={styles.iconContainer}>
                        {taxi}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{taxiTitle}</Text>
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        {shopping}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{shoppingTitle}</Text>
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        {takeOut}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{takeOutTitle}</Text>
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        {activity}
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{activityTitle}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => ({
    logged: state.user.logged,
    jwt: state.user.jwt,
})
export default connect(mapStateToProps, null)(PublishScreen)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.4)",
    },
    header: {
        marginTop: 16,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "grey",
    },
    main:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "blue",
    },
    iconContainer: {
        flex: 1,
        backgroundColor: "green",
    },
    textContainer: {
        backgroundColor: "red",
        alignItems: "center",
    },
    text: {
    },
})
