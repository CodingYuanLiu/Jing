import React from "react"
import { View, Text, StyleSheet, ViewPropTypes } from 'react-native';
import { PropTypes } from "prop-types";
import { Avatar } from 'react-native-elements';
import Default from "../../../constant/Default";


export default class InfoCard extends React.PureComponent{
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    render() {

        const nickname = this.props.nickname;
        const signature = this.props.signature;
        const avatarUri = this.props.avatarUri;
        const avatarSize = this.props.avatarSize;
        const radius = this.props.radius;
        console.log(signature, nickname);

        return(
            <View style={[styles.container, this.props.style, {borderRadius: radius}]}>
                <View style={styles.avatarContainerStyle}>
                    <Avatar rounded size={avatarSize} source={{uri:avatarUri}}/>
                </View>
                <View style={styles.information}>
                    <View style={styles.infoBar}>
                        <Text style={styles.nickname} numberOfLines={1} ellipsizeMode={"tail"}>
                            {nickname}</Text>
                    </View>
                    <View style={[styles.signature, this.props.signatureStyle]}>
                        <Text numberOfLines={1} ellipsizeMode={"tail"}>{signature===""?Default.DEFAULT_SIGNATURE:signature}</Text>
                    </View>
                </View>
            </View>
        )
    }
}


InfoCard.propTypes = {
    style: ViewPropTypes.style,
    avatarUri: PropTypes.string,
    avatarSize: PropTypes.number,
    nickname: PropTypes.string,
    signature: PropTypes.string,
    radius: PropTypes.number,
    onPress: PropTypes.func,
}

InfoCard.defaultProps = {
    size: 50,
    nickname: "用户名",
    radius: 8,
    signature: Default.DEFAULT_SIGNATURE,
    avatarUri: Default.DEFAULT_AVATAR,
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        backgroundColor: "#a2bdff",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
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
        justifyContent: "flex-start",
        alignItems: "center",
    },
    nickname: {
        flex: 1,
        fontSize: 21,
        fontWeight: "300",
        color: "#1a1a1a",
    },
    signature: {
        flex: 1,
        justifyContent: "center",
        color: "#cccccc",
        backgroundColor: "red",
    },
})
