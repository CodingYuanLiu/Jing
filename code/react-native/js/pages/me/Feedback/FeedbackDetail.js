import React from "react";
import {View, StyleSheet, Text, FlatList, ScrollView, TextInput} from "react-native";
import {connect} from "react-redux";
import HeaderBar from "../../../common/components/HeaderBar";
import {ArrowLeftIcon, CommentIcon} from "../../../common/components/Icons";
import NavigationUtil from "../../../navigator/NavUtil";
import UserAvatar from "../../../common/components/UserAvatar";
import {Button, Rating} from "react-native-elements";
import Util from "../../../common/util";
import {WINDOW} from "../../../common/constant/Constant";
import Modal from "react-native-modal";
import Api from "../../../api/Api";
import Model from "../../../api/Model";

class FeedbackDetail extends React.Component{
    constructor(props) {
        super(props);
        let feedback = this.props.navigation.getParam("feedback");
        this.state = {
            feedback,
            isFooterInputVisible: false,
            text: "",
        };
    }

    render() {
        let header = this.renderHeader();
        let feedback = this.renderFeedback(this.state.feedback);
        let comment = this.renderComment(this.state.feedback);
        let footer = this.renderFooter(this.state.feedback);
        let footerInput = this.renderFooterInput();
        return (
            <View
                style={styles.container}
            >
                {header}
                <ScrollView>
                    {feedback}
                    {comment}
                </ScrollView>
                {footer}
                {footerInput}
            </View>
        )
    };

    renderHeader = () => {
        return (
            <HeaderBar
                leftButton={
                    <ArrowLeftIcon
                        color={"#555"}
                        onPress={this.goBack}
                    />
                }
                title={"评论详情"}
                titleStyle={{fontSize: 20, color: "#555"}}
                titleLayoutStyle={{alignItems: "flex-start"}}
                style={styles.headerContainer}
            />
        )
    };

    renderFeedback = (feedback) => {
        let user = this.renderFeedbackUser(feedback);
        let feedbackFooter = this.renderFeedbackFooter(feedback);
        return (
            <View
                style={styles.feedbackContainer}
            >
                {user}
                {this.renderFeedbackCommunication(feedback)}
                {this.renderFeedbackHonesty(feedback)}
                {this.renderFeedbackPunctuality(feedback)}
                {feedbackFooter}
            </View>
        )
    };
    renderFeedbackUser = (feedback) => {
        return(
            <View
                style={styles.feedbackUserContainer}
            >
                <UserAvatar
                    source={{uri: feedback.user.avatar}}
                    id={feedback.user.id}
                    size={36}
                />
                <Text
                    style={styles.feedbackUserTitle}
                >
                    {feedback.user.nickname}
                </Text>
            </View>
        )
    };
    renderFeedbackCommunication = (feedback) => {
        return (
            <View>
                <View
                    style={styles.ratingTitle}
                >
                    <Text
                        style={styles.ratingLabel}
                    >联络状态</Text>
                    <Rating
                        startingValue={feedback.communication.data}
                        style={styles.rating}
                        showRating={false}
                        imageSize={16}
                        ratingCount={5}
                        readOnly={true}
                    />
                </View>
                <Text
                    style={styles.ratingDescription}
                >
                    {feedback.communication.desc}
                </Text>
            </View>
        )
    };
    renderFeedbackHonesty = (feedback) => {
        return (
            <View>
                <View
                    style={styles.ratingTitle}
                >
                    <Text
                        style={styles.ratingLabel}
                    >是否诚信</Text>
                    <Rating
                        startingValue={feedback.honesty.data}
                        style={styles.rating}
                        showRating={false}
                        imageSize={16}
                        ratingCount={5}
                        readOnly={true}
                    />
                </View>
                <Text
                    style={styles.ratingDescription}
                >
                    {feedback.honesty.desc}
                </Text>
            </View>
        )
    };
    renderFeedbackPunctuality = (feedback) => {
        return (
            <View>
                <View
                    style={styles.ratingTitle}
                >
                    <Text
                        style={styles.ratingLabel}
                    >是否准时</Text>
                    <Rating
                        startingValue={feedback.punctuality.data}
                        style={styles.rating}
                        showRating={false}
                        imageSize={16}
                        ratingCount={5}
                        readOnly={true}
                    />
                </View>
                <Text
                    style={styles.ratingDescription}
                >
                    {feedback.punctuality.desc}
                </Text>
            </View>
        )
    };
    renderFeedbackFooter = (feedback) => {
        return (
            <View
                style={styles.feedbackFooterContainer}
            >
                <Text
                    style={styles.feedbackFooterText}
                >
                    {feedback.createTime}
                </Text>

                <CommentIcon
                    color={"#bfbfbf"}
                    size={16}
                />

            </View>
        )
    };
    renderComment = (feedback) => {
        let header = this.renderCommentHeader(feedback);
        return (
            <View
                style={styles.commentContainer}
            >
                {header}
                <FlatList
                    data={feedback.comments}
                    keyExtractor={(item, i) => i.toString()}
                    renderItem={this.renderCommentItem}
                />
            </View>
        )
    };
    renderCommentHeader = (feedback) => {
        return (
            <View
                style={styles.commentListHeaderContainer}
            >
                <View
                    style={{backgroundColor: "#0084ff", width: 3, height: 20, marginRight: 15}}
                />
                <Text
                    style={styles.commentListHeaderText}
                >
                    {`${feedback.comments.length}  条回复`}
                </Text>
            </View>
        )
    };
    renderCommentItem = ({item}) => {
        return (
            <View
                style={styles.commentItemContainer}
            >
                <View
                    style={styles.commentUserContainer}
                >
                    <UserAvatar
                        source={{uri: item.avatar}}
                        id={item.id}
                    />
                    <Text
                        style={{fontSize: 16, marginLeft: 15}}
                    >{item.nickname}</Text>
                </View>
                <Text
                    style={styles.commentText}
                >
                    {item.description}
                </Text>
                <View
                    style={styles.commentFooterContainer}
                >
                    <Text
                        style={styles.commentFooterText}
                    >{Util.dateTimeToDisplayString(new Date(item.time))}</Text>
                    <CommentIcon
                        color={"#bfbfbf"}
                        size={16}
                    />
                </View>
            </View>
        )
    };

    renderFooter = (feedback) => {
        let {currentUser} = this.props;
        return (
            <View
                style={styles.footerContainer}
            >
                <UserAvatar
                    source={{uri: currentUser.avatar}}
                    id={currentUser.id}
                    size={20}
                />
                <Text
                    style={styles.footerInput}
                    onPress={() => {this.setState({isFooterInputVisible: true})}}
                >
                    {`回复${feedback.user.nickname}`}
                </Text>
                <View
                    style={styles.footerIconContainer}
                >
                    <Text
                        style={{color: "#bfbfbf", fontWeight: "bold"}}
                    >
                        {feedback.comments.length}
                    </Text>
                    <CommentIcon
                        size={16}
                        color={"#bfbfbf"}
                    />
                </View>
            </View>
        )
    };

    renderFooterInput = () => {
        return (
            <Modal
                useNativeDriver={true}
                isVisible={this.state.isFooterInputVisible}
                onBackdropPress={() => {this.setState({isFooterInputVisible: false})}}
                backdropOpacity={0.5}
                style={{margin: 0}}
            >
                <View
                    style={styles.footerModalContainer}
                >
                    <Text
                        style={styles.footerIndicator}
                    >{`${this.state.text.length}/150`}</Text>
                    <View
                        style={styles.footerInputContainer}
                    >
                        <TextInput
                            value={this.state.text}
                            onChangeText={(text) => {this.setState({text})}}
                            style={styles.footerTextInput}
                            placeholder={"友善的评论是交流的起点"}
                            multiline={true}
                        />
                        <Button
                            title={"发布"}
                            onPress={this.addComment}
                            buttonStyle={styles.footerModalButton}
                            disabled={this.state.text.length === 0}
                            disabledTitleStyle={{color: "#fff"}}
                            disabledStyle={{
                                backgroundColor: "#dfe9ff"
                            }}
                            containerStyle={styles.footerModalButtonContainer}
                        />
                    </View>
                </View>
            </Modal>
        )
    };

    goBack = () => {
        NavigationUtil.back(this.props);
    };
    addComment = () => {
        let comment = {
            id: this.state.feedback.id,
            text: this.state.text,
            time: Util.dateTimeToString(new Date()),
        };
        let {currentUser} = this.props;

        Api.commentFeedback(Model.buildFeedbackComment(comment), currentUser)
            .then(() => {
                this.setState(state => {
                    let comments = state.feedback.comments;
                    comments.push({
                        description: comment.text,
                        avatar: currentUser.avatar,
                        id: currentUser.id,
                        nickname: currentUser.nickname,
                        time: comment.time,
                    });

                    return {
                        ...state,
                        feedback: {
                            ...state.feedback,
                            comments: [...comments],
                        }
                    }
                })
            })
            .catch(err => {
                console.log(err);
            })


    };
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});

export default connect(mapStateToProps, null)(FeedbackDetail);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3",
    },
    headerContainer: {
        backgroundColor: "#fff",
        elevation: 2,
    },


    feedbackContainer: {
        padding: 15,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },

    feedbackUserContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    feedbackUserTitle: {
        marginLeft: 15,
        fontSize: 16,
        color: "#555",
        fontWeight: "bold",
    },
    ratingTitle: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingLabel: {
        color: "#0084ff",
        fontSize: 15,
    },
    rating: {
        flex: 0,
        marginLeft: 15,
    },
    ratingDescription: {
        fontSize: 15,
        color: "#555",
        backgroundColor: "#fdfdfd",
        borderRadius: 3,
        marginTop: 3,
        marginBottom: 3,
        paddingLeft: 8,
    },
    feedbackFooterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 6,
    },
    feedbackFooterText: {
        color: "#999",
        fontSize: 13,
    },

    commentContainer: {
        marginTop: 2,
        marginBottom: 74,
    },
    commentListHeaderContainer: {
        height: 36,
        flexDirection: "row",
        alignItems: "center",
    },
    commentListHeaderText: {
        fontSize: 16,
        color: "#555",
    },
    commentItemContainer: {
        marginBottom: 4,
        marginTop: 4,
        backgroundColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 6,
        paddingBottom: 6,

    },
    commentUserContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    commentText: {
        fontSize: 15,
        color: "#555",
        paddingLeft: 10,
        marginTop: 6,
        marginBottom: 6,
    },
    commentFooterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    commentFooterText: {
        color: "#bfbfbf",
        fontSize: 15,
    },

    footerContainer: {
        height: 48,
        width: WINDOW.width,
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    footerInput: {
        borderRadius: 20,
        height: 36,
        backgroundColor: "#eee",
        flex: 1,
        marginRight: 10,
        marginLeft: 15,
        paddingLeft: 10,
        lineHeight:　34,
    },
    footerIconContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    footerModalContainer: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "#fff",
        width: WINDOW.width,
        height: 100,
        padding: 15,
    },
    footerIndicator: {
        flex: 1,
        marginLeft: 10,
    },
    footerInputContainer: {
        height: 40,
        width: WINDOW.width - 30,
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    footerTextInput: {
        borderRadius: 30,
        backgroundColor: "#eee",
        fontSize: 15,
        flex: 1,
        paddingRight: 88,
        paddingLeft: 8,
    },
    footerModalButtonContainer: {
        position: "absolute",
        right: 0,
    },
    footerModalButton: {
        backgroundColor: "#77c6ff",
        borderRadius: 50,
        height: 40,
        width: 80,
    },
});
