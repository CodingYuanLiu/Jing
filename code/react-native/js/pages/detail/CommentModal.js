import React from "react"
import { View, Text, ScrollView, StyleSheet, TextInput} from 'react-native';
import NoXXX from "../../common/components/NoXXX";
import {Button, Icon } from "react-native-elements";
import {CloseIcon, EmojiIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import Modal from "react-native-modal";

export default class CommentModal extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            commentLength: 0,
            commentContent: "",
            replyComment: "",
            replyTo: "",
            commentInputModalVisible: false,
            commentIndicatorVisible: true,
        }
    }

    componentDidMount(){
        let comments = this.props.navigation.getParam("comments");
        console.log(comments);
        this.setState({comments: comments, commentLength: comments.length})
    }

    renderHeader = () => {
        let length = this.state.comments ? this.state.comments.length : 0;
        let closeIcon =
            <CloseIcon
                color={"#6d6d6d"}
                size={24}
                onPress={() => {NavigationUtil.back(this.props)}}
            />;
        let title =
            <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>全部{length}条评论</Text>
            </View>;

        // I did not find what i want, leave it blank for future refine
        // let rightIcon;
        return (
            <View style={styles.headerContainer}>
                {closeIcon}
                {title}
            </View>
        )
    };

    renderComments = comments => {
        if (comments && comments.length > 0 ) {
            return (
                <ScrollView>

                </ScrollView>
            )

        } else {
            let noCommentIcon =
                <Icon
                    type={"octicon"}
                    name={"comment-discussion"}
                    size={80}
                    color={"#e0e0e0"}
                />;
            return (
                <NoXXX
                    icon={noCommentIcon}
                    labelText={"还没有人评论哦，第一个评论吧"}
                    textSize={15}
                />
                )
        }
    };

    renderFooter = () => {
        // Emoji support may be difficult, but I determined to support this
        let emojiIcon =
            <EmojiIcon
                color={"#6d6d6d"}
                size={30}
            />;
        let inputComponent =
            <View style={styles.footerTextContainer}>
                <Text
                    onPress={() => {this.inputComment({
                        userId: -1,
                        username: "",
                    })}}
                    style={styles.footerText}
                >
                    {this.state.commentIndicatorVisible ? "请输入评论" : ""}
                </Text>
            </View>;
        let rightButton =
            <Button
                title={"发布"}
                type={"clear"}
                onPress={this.publishComment}
            />;
        return (
            <View style={styles.footerContainer}>
                {emojiIcon}
                {inputComponent}
                {rightButton}
            </View>
        )
    };
    renderCommentModal = () => {
        let footer = this.renderFooter();
        return (
            <Modal
                isVisible={this.state.commentInputModalVisible}
                backdropColor={"rgb(0,0,0)"}
                style={styles.commentModal}
                onBackdropPress={this.closeInputComment}
                useNativeDriver={true}
                avoidKeyboard
            >
                <View style={styles.commentModalChild}>
                    <View>
                        <Text style={styles.footerText}>正在回复给{this.state.replyTo}</Text>
                    </View>
                    <TextInput
                        selectionColor={"#0084ff"}
                        placeholder={"友善的评论是交流的起点"}
                        placeholderTextColor={"#bfbfbf"}
                        inputContainerStyle={styles.commentInputContainer}
                        autoFocus={true}
                        style={styles.commentModalInput}
                        value={this.state.commentContent}
                        onChangeText={value => {this.setState({commentContent: value})}}
                    />
                    {footer}
                </View>
            </Modal>
        )
    }
    render() {
        let header = this.renderHeader();
        let commentList = this.renderComments(this.state.comments);
        let footer = this.renderFooter();
        let commentModal = this.renderCommentModal();
        return(
            <View style={{flex: 1, backgroundColor: "#0084ff"}}>
                <View style={styles.container}>
                    {header}
                    <View style={styles.commentListContainer}>
                        {commentList}
                    </View>
                    {commentModal}
                    {footer}
                </View>
            </View>
        );
    };

    publishComment = () => {
        let content = this.state.commentContent;
        let receiverId = this.state.replyTo;
        let replyComment = this.state.replyComment;
        // some problems here

    };

    inputComment = (replyTo) => {
        this.setState({
            commentIndicatorVisible: false,
            commentInputModalVisible: true,
            replyTo: replyTo
        })
    };
    closeInputComment = () => {
        this.setState({
            commentIndicatorVisible: true,
            commentInputModalVisible: false,
        })
    }
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex:1,
        height: "100%",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    headerContainer: {
        paddingLeft: "6%",
        paddingRight: "6%",
        flexDirection: "row",
        height: 48,
        alignItems: "center",
        width: "100%",
    },
    headerTitleContainer: {
        marginLeft: 14,
    },
    headerTitle: {
        fontWeight: "700",
        fontSize: 18,
        color: "#6d6d6d",
    },
    commentListContainer: {
        borderTopWidth: 1,
        borderColor: "#d3d3d3",
        flex: 1,
        width: "100%",
        paddingLeft: "6%",
        paddingRight: "6%",
    },

    footerContainer: {
        flexDirection: "row",
        height: 48,
        borderTopWidth: 1,
        borderTopColor: "#d3d3d3",
        alignItems: "center",
        paddingLeft: "6%",
        paddingRight: "6%",
    },
    footerTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    footerText: {
        color: "#bfbfbf",
        fontSize: 16,
    },
    commentModal: {
        width: "100%",
        position: "absolute",
        margin: 0,
        bottom: 0,
    },
    commentModalChild: {
        width: "100%",
        backgroundColor: "#fff",
    },
    commentInputContainer: {
        borderWidth: 0
    },
    commentModalInput: {
        borderWidth: 0,
        fontSize: 18
    },
});
