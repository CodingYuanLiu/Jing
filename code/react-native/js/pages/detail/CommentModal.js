import React from "react"
import { View, Text, ScrollView, StyleSheet, TextInput, FlatList} from 'react-native';
import NoXXX from "../../common/components/NoXXX";
import {Button, Icon } from "react-native-elements";
import {CloseIcon, EmojiIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import Modal from "react-native-modal";
import {connect} from "react-redux";
import Activity from "../../actions/activity";
import Util from "../../common/util";
import Comment from "./components/Comment";

class CommentModal extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            commentContent: "",
            receiverName: "",
            receiverId: -1,
            commentInputModalVisible: false,
            commentIndicatorVisible: true,
        }
    }

    componentDidMount(){
        this.sponsor= this.props.navigation.getParam("sponsor");
        this.setState({receiverName: this.sponsor});
    }

    render() {
        let header = this.renderHeader();
        let commentList = this.renderComments(this.props.currentAct.comments);
        let footer = this.renderFooter(true);
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

    renderHeader = () => {
        let length = this.props.currentAct.comments ? this.props.currentAct.comments.length : 0;
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
    renderCommentItem = ({item}) => {
        return (
            <Comment
                avatar={item.avatar_url ? item.avatar_url : "https://pic.qqtn.com/up/2019-5/2019053019011498462.jpg"}
                content={item.content}
                time={item.time}
                receiverName={item.receiver_name? item.receiver_name :"未知"}
                username={item.user_nickname}
                onPress={() => {
                    this.openCommentModal(item.user_id, item.user_nickname)
                }}
                receiverId={item.receiver_id}
            />
            );
    };
    renderComments = comments => {
        if (comments && comments.length > 0 ) {
            return (
                <FlatList
                    data={comments}
                    renderItem={this.renderCommentItem}
                />
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

    renderFooter = (topBorder) => {
        // Emoji support may be difficult, but I determined to support this
        let emojiIcon =
            <EmojiIcon
                color={"#6d6d6d"}
                size={30}
            />;
        let inputComponent =
            <View style={styles.footerTextContainer}>
                <Text
                    onPress={() => {this.openCommentModal(-1, this.sponsor)}}
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
                disabled={this.state.commentContent === ""}
            />;
        return (
            <View style={[styles.footerContainer, topBorder ? {borderTopWidth: 0.5}: null]}>
                {emojiIcon}
                {inputComponent}
                {rightButton}
            </View>
        )
    };
    renderCommentModal = () => {
        let footer = this.renderFooter(false);
        return (
            <Modal
                isVisible={this.state.commentInputModalVisible}
                onBackdropPress={this.closeCommentModal}
                backdropColor={"rgba(0,0,0,0.4)"}
                style={styles.commentModal}
                useNativeDriver={true}
                swipeDirection={"down"}
                onSwipeComplete={this.closeCommentModal}
            >
                <View style={styles.commentModalChild}>
                    <View>
                        <Text style={styles.commentModalReplyText}>
                            {this.state.receiverId === 1 ? `评论给 ${this.state.receiverName}(作者)` :
                                `正在回复给 ${this.state.receiverName}`}
                        </Text>
                    </View>
                    <TextInput
                        selectionColor={"#0084ff"}
                        placeholder={"友善的评论是交流的起点"}
                        placeholderTextColor={"#bfbfbf"}
                        inputContainerStyle={styles.commentInputContainer}
                        autoFocus
                        style={styles.commentModalInput}
                        value={this.state.commentContent}
                        onChangeText={value => {this.setState({commentContent: value})}}
                    />
                    {footer}
                </View>
            </Modal>
        )
    };

    publishComment = () => {
        let comment = {
            receiver_id: this.state.receiverId,
            content: this.state.commentContent,
            act_id: this.props.currentAct.act_id,
            time: Util.dateTimeToString(new Date()),
            user_id: this.props.user.id,
            user_nickname: this.props.user.nickname,
        };
        this.props.addComment(comment, this.props.user.jwt);
    };

    openCommentModal = (receiverId, receiverName) => {
        if(!this.state.commentInputModalVisible) {
            this.setState({
                commentIndicatorVisible: false,
                commentInputModalVisible: true,
                receiverId: receiverId,
                receiverName: receiverName,
            })
        }
    };
    closeCommentModal = () => {
        this.setState({
            commentIndicatorVisible: true,
            commentInputModalVisible: false,
            receiverId: -1,
            receiverName: this.sponsor,
        })
    }
}

const mapStateToProps = state => ({
    currentAct: state.currentAct,
    user: state.user,
});
const mapDispatchToProps = dispatch => ({
    addComment: (comment, jwt) => dispatch(Activity.addComment(comment, jwt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentModal);

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex:1,
        height: "100%",
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    headerContainer: {
        paddingLeft: "5%",
        paddingRight: "5%",
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
    },

    footerContainer: {
        flexDirection: "row",
        height: 48,
        borderTopColor: "#d3d3d3",
        alignItems: "center",
        paddingLeft: "5%",
        paddingRight: "5%",
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
    commentModalReplyText: {
        fontSize: 14,
        paddingLeft: 22,
        paddingTop: 10,
        paddingBottom: 10,
    },
    commentInputContainer: {
        borderWidth: 0
    },
    commentModalInput: {
        borderWidth: 0,
        fontSize: 16,
        paddingLeft: 22,
        paddingTop: 5,
        paddingBottom: 5,
    },
});
