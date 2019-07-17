import React from "react"
import { View, Text, ViewPropTypes, StyleSheet } from 'react-native';
import { PropTypes } from "prop-types";
import Default from "../../../constant/Default"
import {Avatar, } from "react-native-elements";
import styles from "react-native-webview/lib/WebView.styles";

export default class UserBar extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let nickname = this.props.nickname;
        let signature = this.props.signature;
        let avatarUri = this.props.avatarUri;
        return(
            <View style={[styles.container, {height: this.props.height}]}>
                <Avatar
                    rounded
                    source={{uri: avatarUri}}
                    size={10}
                />
                <View style={styles.nickname}>
                    <Text style={styles.text}>{nickname}</Text>
                </View>
                <View style={styles.signature}>
                    <Text style={styles.text}>{signature}</Text>
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

styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flex: 1,
        height: 10,
        justifyContent: "flex-start",
    },
    nickname: {
        marginLeft: 3,
        justifyContent: "center",
        alignItems: "center",
    },
    signature: {
        marginLeft: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
      fontSize: 10,
        flex: 1,
    },
})
