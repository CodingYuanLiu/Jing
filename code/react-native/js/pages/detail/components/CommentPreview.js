import React from "react";
import {View, Text, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {PropTypes} from "prop-types";
import UserNickname from "../../../common/components/UserNickname";
import UserAvatar from "../../../common/components/UserAvatar";

export default class CommentPreview extends React.PureComponent {
    constructor(props){
        super(props)
    };

    render() {
        let {avatar, content, nickname, onPress, id} = this.props;
        let leftAvatar = this.renderAvatar(avatar, id);
        let title = this.renderTitle(nickname, id);
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
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    };
    renderTitle = (nickname, id) => {
        return (
            <View style={styles.titleContainer}>
                <UserNickname
                    style={styles.title}
                    title={nickname}
                    id={id}
                />
            </View>
        )
    };
    renderBody = (content) => {
        return (
            <View style={styles.bodyContainer}>
                <Text
                    style={styles.bodyText}
                    numberOfLines={2}
                    ellipsizeMode={"tail"}
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
                size={24}
                id={id}
            />
        )
    };
}

CommentPreview.propTypes = {
    avatar: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
};


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        paddingBottom: 8,
    },
    mainContainer: {
        flex: 1,
        marginLeft: 6,
    },
    titleContainer: {

    },
    title: {
        fontSize: 14,
        color: "#bfbfbf",
    },
    bodyText: {
        fontSize: 14,
        color: "#3a3a3a",
    },
});
