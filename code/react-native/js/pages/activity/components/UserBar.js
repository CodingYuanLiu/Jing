import React from "react"
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';
import { PropTypes } from "prop-types";
import Default from "../../../constant/Default"
import {Avatar, } from "react-native-elements";

export default class UserBar extends React.PureComponent{
    constructor(props) {
        super(props);
        console.log(props)
    }

    render() {
        let nickname = this.props.nickname;
        let signature = this.props.signature;
        let avatarUri = this.props.avatarUri;
        return(
            <View style={[styles.container]}>
                <Avatar
                    rounded
                    source={{uri: avatarUri}}
                    size={26}
                    containerStyle={styles.avatar}
                />
                <View style={styles.nicknameContainer}>
                    <Text style={styles.nickname}>{nickname}</Text>
                </View>
                <View style={styles.signatureContainer}>
                    <Text style={styles.signature}>{signature}</Text>
                </View>

            </View>
        )
    }
}

UserBar.propTypes = {
    nickname: PropTypes.string.isRequired,
    avatarUri: PropTypes.string.isRequired,
    signature: PropTypes.string.isRequired,
    height: PropTypes.number,
}

UserBar.defaultProps = {
    avatarUri: Default.DEFAULT_AVATAR,
    height: Default.USERBAR_HEIGHT,
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    avatar:{
        marginLeft: 8,
    },
    nicknameContainer: {
        marginLeft: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    signatureContainer: {
        marginLeft: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    nickname: {
        fontSize: 16,
        color: "#525252",
    },
    signature: {
        fontSize: 12,
        color: "#a9a9a9",
    },
})
