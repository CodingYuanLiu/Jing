import React from "react"
import { View, Text, StyleSheet, ViewPropTypes, FlatList } from 'react-native';
import { PropTypes } from "prop-types";
import { Icon } from 'react-native-elements';
import Entypo from "react-native-vector-icons/Entypo";
import NavigationUtil from '../../../navigator/NavUtil';


export default class SignOutInfoCard extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    renderItem = ({item}) => {
        return item.icon
    }

    render() {
        const title = this.props.title
        const icons = this.props.LoginMenu

        return(
            <View style={[styles.container, this.props.style]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View>
                    <FlatList
                        data={icons}
                        renderItem={this.renderItem}
                        contentContainerStyle={styles.iconContainer}
                    />
                </View>
            </View>
        )
    }
}


SignOutInfoCard.propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleStyle: ViewPropTypes.style,
    LoginMenu: PropTypes.array
}

const LoginWithPhone =
    <Icon
    type={"material-community"}
    name={"cellphone-iphone"}
    reverse
    color={"#0084ff"}
    onPress={() => {alert("即应还不能用手机登录哦～")}}
    />
const LoginWithPassword =
    <Icon
        type={"foundation"}
        name={"key"}
        reverse
        color={"#0084ff"}
        onPress={() => {NavigationUtil.toPage(null, "Login")}}
    />
const LoginWithWechat =
    <Icon
        type={"antdesign"}
        name={"wechat"}
        reverse
        color={"#67c13b"}
        onPress={() => {alert("即应还不能用微信登录哦～")}}
    />
const LoginWithJaccount =
    <Icon
        type={"foundation"}
        name={"key"}
        reverse
        color={"#0084ff"}
        onPress={() => {NavigationUtil.toPage(null, "Jaccount")}}
    />
SignOutInfoCard.defaultProps = {
    title: "登录即应，体验更多功能",
    LoginMenu: [
        {
            icon: LoginWithPhone,
        },
        {
            icon: LoginWithPassword,
        },
        {
            icon: LoginWithWechat,
        },
        {
            icon: LoginWithJaccount,
        },
    ]
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: "100%",
        backgroundColor: "#a2bdff",
    },
    titleContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
    }
})
