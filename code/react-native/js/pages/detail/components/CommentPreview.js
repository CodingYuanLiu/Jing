import React from "react";
import {View, Text, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {CaretRightIcon} from "../../../common/components/Icons";
import {Avatar} from "react-native-elements";
import {PropTypes} from "prop-types";

export default class CommentPreview extends React.PureComponent {
    constructor(props){
        super(props)
    };

    render() {
        let {avatar, content, username, onPress} = this.props;
        let leftAvatar = this.renderAvatar(avatar);
        let title = this.renderTitle(username);
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
    renderTitle = (username) => {
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{username}</Text>
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
    renderAvatar = (avatar) => {
        return (
            <Avatar
                source={{uri: avatar}}
                rounded
                size={24}
                onPress={() => {alert("you pressed avatar")}}
            />
        )
    };
}

CommentPreview.propTypes = {
    avatar: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
};


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        paddingLeft: "5%",
        paddingRight: "5%",
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
