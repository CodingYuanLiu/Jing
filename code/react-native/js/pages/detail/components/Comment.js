import React from "react";
import {View, Text, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {CaretRightIcon} from "../../../common/components/Icons";
import {PropTypes} from "prop-types";
import {ReplyIcon} from "../../../common/components/Icons";
import UserAvatar from "../../../common/components/UserAvatar";

export default class Comment extends React.PureComponent {
    constructor(props){
        super(props)
    }

    render() {
        let {avatar, content, time, receiverName, nickname, onPress, receiverId, id} = this.props;
        let leftAvatar = this.renderAvatar(avatar);
        let footer = this.renderFooter(time);
        let title = this.renderTitle(nickname, receiverName, receiverId);
        let body = this.renderBody(content);
        return (
            <TouchableWithoutFeedback
                onPress={onPress}
            >
                <View style={styles.container}>
                    {leftAvatar}
                    <View style={styles.mainContainer}>
                        {title}
                        {body}
                        {footer}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    renderTitle = (from, to, toId) => {
        let caretIcon =
            <CaretRightIcon
                color={"#838383"}
                size={14}
                style={styles.caretContainer}
            />;
        let fromTitle=<Text style={styles.title}>{from}</Text>;
        let toTitle = <Text style={styles.title}>{to}</Text>;
        return (
            <View style={styles.titleContainer}>
                {fromTitle}
                {toId !== -1 ? caretIcon : null}
                {toId !== -1 ? toTitle : null}
            </View>
        )
    };
    renderBody = (content) => {
        return (
            <View style={styles.bodyContainer}>
                <Text
                    style={styles.bodyText}
                    multiLine
                >
                    {content}
                </Text>
            </View>
        )
    };
    renderAvatar = (avatar, id) => {
        return (
            <UserAvatar
                source={{uri: avatar}}
                rounded
                containerStyle={styles.avatar}
                id={id}
            />
        )
    };
    renderFooter = (time) => {
        return (
            <View style={styles.footerContainer}>
                <Text style={styles.footerText}>
                    {time}
                </Text>
                <ReplyIcon
                    color={"#bfbfbf"}
                    style={styles.replyIcon}
                />
            </View>
        )
    }
}

Comment.propTypes = {
    avatar: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    receiverId: PropTypes.number.isRequired,
    receiverName: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#efefef",
        width: "100%",
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: 6,
        paddingBottom: 12,
    },
    avatar: {
        marginTop: 5,
    },
    mainContainer: {
        flex: 1,
        marginLeft: 8,
        marginTop: 8,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#3a3a3a",
    },
    caretContainer: {
        paddingLeft: 8,
        paddingRight: 8,
    },
    bodyContainer: {
        marginTop: 6,
        marginBottom: 18,
    },
    bodyText: {
        fontSize: 16,
        color: "#4a4a4a",
        fontWeight: "500",
    },
    footerContainer: {
        marginBottom: 8,
        flexDirection: "row",
    },
    footerText: {
        fontSize: 12,
        color: "#bfbfbf",
        flex: 1,
    },
    replyIcon: {
        paddingLeft: 10,
    },
});
