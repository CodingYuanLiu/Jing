import React from "react"
import { View, Text, StyleSheet} from 'react-native';
import {Avatar, Button, Icon} from 'react-native-elements';
import { PropTypes } from "prop-types";
import Default from "../../../constant/Default";

export default class Comment extends React.PureComponent{
    constructor(props) {
        super(props);
    }

    render() {
        let nickname=this.props.nickname;
        let avatarUri = this.props.avatarUri;
        let avatarSize = this.props.avatarSize;
        let comment = this.props.comment;
        let rightIcon = this.props.rightIcon ?
            this.props.rightIcon :
            <Icon
                type={"antdesign"}
                name={"like2"}
                color={"#949494"}
                containerStyle={styles.avatarContainer}
            />;
        let footer=this.props.footer ? this.props.footer :
            <View></View>

        return(
            <View style={styles.container}>
                <View style={styles.mainContainer}>
                    <Avatar
                        source={{uri: avatarUri}}
                        rounded
                        size={avatarSize}
                        containerStyle={styles.avatarContainer}
                    />
                    <View style={styles.middleContainer}>
                        <Text style={styles.nickname}>{nickname}</Text>
                        <Text ellipsizeMode={"tail"}
                              style={styles.comment}
                              numberOfLines={3}>{comment}</Text>
                    </View>
                    {rightIcon}
                </View>
                {footer}
            </View>
        )
    }
}

Comment.propTypes = {
    avatarUri: PropTypes.string.isRequired,
    avatarSize: PropTypes.number,
    nickname: PropTypes.string.isRequired,
    footer: PropTypes.element,
    rightIcon: PropTypes.element,
    comment: PropTypes.string.isRequired,
}

Comment.defaultProps = {
    avatarUri: Default.DEFAULT_AVATAR,
    nickname: "anonymous",
    comment: "no comment",
    avatarSize: Default.DEFAULT_AVATAR_SIZE,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer:{
        flex: 1,
        flexDirection: "row",
    },
    avatarContainer: {
        alignSelf: "flex-start",
        justifyContent: "center",
    },
    middleContainer: {
        flex: 1,
        flexDirection: "column",
    },
    nickname: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    comment: {
        color: "#b4b4b4",
    },
})
