import React from "react"
import { View, Text, StyleSheet, ViewPropTypes } from 'react-native';
import { PropTypes } from "prop-types";
import { Avatar, Divider } from 'react-native-elements';
import Entypo from "react-native-vector-icons/Entypo";

const avatarParamsShape = {
    rounded: PropTypes.bool,
    size: PropTypes.number,
    title: PropTypes.string,
}

const userShape={
    username: PropTypes.string,
    credit: PropTypes.string,
    signature: PropTypes.string,
    avatarUri: PropTypes.string,
}

export default class InfoCard extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {

        const username = this.props.user.username;
        const credit = this.props.user.credit;
        const signature = this.props.user.signature;
        const avatarUri = this.props.user.avatarUri;
        const avatarParams = this.props.avatarParams ? this.props.avatarParams : {};

        const creditComponent = <Text ellipsizeMode={"tail"} numberOfLines={1}>{credit}</Text>;
        return(
            <View style={[styles.container, this.props.style]}>
                <View style={styles.avatarContainerStyle}>
                    <Avatar {...avatarParams} source={avatarUri === "" ? null : {uri:avatarUri}}/>
                </View>
                <View style={styles.information}>
                    <View style={styles.infoBar}>
                        <Text style={styles.username}>{username}</Text>
                        <View style={[styles.credit, this.props.creditStyle]}>
                            {creditComponent}
                        </View>
                    </View>
                    <View style={[styles.signature, this.props.signatureStyle]}>
                        <Text>{signature}</Text>
                    </View>
                </View>
                <View style={[styles.rightIcon, this.props.rightIconStyle]}>
                    <Entypo
                        name={"chevron-thin-right"}
                        size={32}
                        color={"#b3b3b3"}
                        onPress={this.props.onPress}
                    />
                </View>
            </View>
        )
    }
}


InfoCard.propTypes = {
    avatarParams: PropTypes.shape(avatarParamsShape),
    status: PropTypes.bool, // 登录(true)/未登录(false)
    avatarStyle: ViewPropTypes.style,
    style: ViewPropTypes.style,
    topStyle: ViewPropTypes.style,
    avatarContainerStyle: ViewPropTypes.style,
    creditStyle: ViewPropTypes.style,
    signatureStyle: ViewPropTypes.style,
    rightIconStyle: ViewPropTypes.style,
    user: PropTypes.shape(userShape),
    onPress: PropTypes.func.isRequired,
}

InfoCard.defaultProps = {
    avatarParams:{
        rounded: true,
        title: "Ava",
        size: 70,
    },
    user: {
        username: "用户名",
        credit: "小白",
        signature: "这里一无所有在，直到遇见你",
        avatarUri: ""
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: "100%",
        backgroundColor: "#a2bdff",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    topRound:{
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
    },
    avatarContainerStyle: {
        marginLeft: 10,
        marginRight: 12,
    },
    information: {
        flex: 1,
        paddingLeft: 8,
    },
    infoBar:{
        flexDirection: "row",
        marginTop: 10,
        backgroundColor: "red",
        alignItems: "center",
    },
    username: {
        flex: 1,
        fontSize: 21,
        fontWeight: "300",
    },
    credit: {
        flex: 1,
        marginLeft: 16,
        height: 32,
        justifyContent: "center",
        backgroundColor: "green",
    },
    signature: {
        flex: 1,
        backgroundColor: "blue",
        justifyContent: "center",
    },
    rightIcon: {
        marginRight: 16,
    },
})
