import React from "react";
import {View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback, StatusBar} from "react-native"
import {Button, Icon, Image, ListItem, Avatar} from "react-native-elements";
import NavigationUtil from "../../navigator/NavUtil";
import {
    ArrowLeftIcon, CheckIcon,
    CommentIcon,
    EditIcon,
    EllipsisIcon,
    PaperPlaneIcon,
    PlusIcon
} from "../../common/components/Icons";
import Tag from "../../common/components/Tag";
import Activity from "../../actions/activity";
import {connect} from "react-redux";
import Util from "../../common/util";
import Api from "../../api/Api";
import CommentPreview from "./components/CommentPreview";
import {onFollow, onUnFollow} from "../../actions/currentUserFollowing";
import UserAvatar from "../../common/components/UserAvatar";
import UserNickname from "../../common/components/UserNickname";
import HeaderBar from "../../common/components/HeaderBar";
import ToolTip from "../../common/components/ToolTip";


class DetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            activity: {},
            isLoading: false,
            isFriends: false,
            actionModalVisible: false,
            joinStatus: 0,
        };
        this.actId = this.props.navigation.getParam("id");
    }

    componentDidMount(){
        this.loadData(this.actId, this.props.currentUser.jwt,
            this.props.currentUser.id, this.props.currentUserFollowing.items);
    }

    render() {
        let activity = this.props.currentAct;
        let {title, comments, tags, images,
            createTime, description, sponsor} = activity;
        let specInfo = {}; // waiting for modifying
        let header = this.renderHeader();
        let ActTitle = this.renderTitle(title, tags);
        let body = this.renderBody(sponsor, specInfo, description, images, createTime, comments);
        let footer = this.renderFooter();
        return(
            <View style={{flex: 1,}}>
                {header}
                <ScrollView
                    style={styles.container}
                    onScroll={this._onScroll}
                >
                    {ActTitle}
                    {body}
                </ScrollView>
                {footer}
            </View>
        );
    };
    renderHeader = () => {
        let leftIcon = (
            <ArrowLeftIcon
                color={"#5a5a5a"}
                onPress={this.goBack}
                size={24}
            />
        );
        let rightIcon = this.renderToolTip();
        return(
            <HeaderBar
                leftButton={leftIcon}
                style={{
                        backgroundColor: "#fff",
                        marginLeft: 12,
                        marginRight: 12,
                    }}
                rightButton={rightIcon}
            />
        );
    };
    renderToolTip = () => {
        let { currentAct } = this.props;
        let deleteButton = null;
        if (currentAct.isSelf) {
            deleteButton = (
                <Button
                    title={"删除"}
                    type={"clear"}
                    onPress={this.deleteAct}
                />
            )
        }
        return (
            <ToolTip>
                <Button
                    title={"夜晚模式"}
                    type={"clear"}
                    onPress={this.toggleEveningMode}
                />
                {deleteButton}
            </ToolTip>
        );
    };
    renderTitle = (title, tags) => {
        return (
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.tagContainer}>
                    {
                        tags && tags.length > 0 ?
                            tags.map((tag, i) => {
                                return(
                                    <Tag
                                        title={tag}
                                        key={i}
                                    />);
                            }) : null
                    }
                </View>
            </View>
        );
    };
    renderBody = (sponsor, specInfo, description, images, createTime, comments) => {
        let comment = this.renderComment(comments);
        let sponsorComponent = this.renderSponsor(sponsor);
        return (
            <View style={styles.bodyContainer}>
                <View style={styles.bodyContent}>
                    {sponsorComponent}
                    <View>
                        <Text style={styles.bodyText}>{description}</Text>
                    </View>
                    <View>
                        {
                            images && images.length > 0 ? images.map((item, i) => {
                                return (
                                    <Image
                                        source={{uri: item}}
                                        key={i}
                                        style={styles.bodyImage}
                                    />)
                            }): null
                        }
                    </View>
                    <View style={styles.bodyBottomContainer}>
                        <Text style={styles.metadata}>发布于{createTime}</Text>
                    </View>
                </View>
                <View>
                    {comment}
                </View>
            </View>

        )
    };
    renderSponsor = sponsor => {
        let followBtn =
            this.props.currentAct.isFriends ?
            <Button
                title={"取消关注"}
                titleStyle={{color: "#9a9a9a"}}
                buttonStyle={styles.followBtn}
                onPress={this.unFollow}
                loading={this.state.isUnFollowing}
                containerStyle={{width: 100,}}
            />:
                <Button
                    title={"关注"}
                    titleStyle={{color: "#0084ff"}}
                    buttonStyle={styles.followBtn}
                    onPress={this.follow}
                    loading={this.state.isFollowing}
                    icon={
                        <PlusIcon
                            size={24}
                            color={"#0084ff"}
                        />
                    }
                    containerStyle={{width: 100,}}
                />;
        let avatar = (
            <UserAvatar
                source={{uri: sponsor.avatar }}
                title={""}
                size={36}
                id={sponsor.id}
            />
        );
        let nickname = (
            <UserNickname
                title={sponsor.nickname}
                id={sponsor.id}
            />
        );
        return (
            <ListItem
                leftAvatar={avatar}
                title={nickname}
                titleProps={{
                    numberOfLines: 1,
                    ellipsizeMode: "tail",
                    onPress: this.toUserPersonalPage
                }}
                titleStyle={styles.userInfoTitle}
                subtitle={sponsor.signature}
                subtitleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                subtitleStyle={styles.userInfoSubtitle}
                rightElement={this.props.currentAct.isSelf ? null : followBtn}
                containerStyle={styles.userInfoContainer}
                contentContainerStyle={{position: "relative", left: -5}}
            />
        )
    };
    renderCommentPreview = (comments) => {
        let previewComments = this.getPreviewComments(comments);
        return (
            <View>
                {
                    previewComments.map((comment, i) => {
                    return (
                        <CommentPreview
                            avatar={comment.user.avatar}
                            id={comment.user.id}
                            content={comment.content}
                            nickname={comment.user.nickname}
                            key={i.toString()}
                        />
                        );
                    })
                }
            </View>
        )
    };
    renderComment = (comments) => {
        let commentPreview = this.renderCommentPreview(comments);
        let commentButton =
            <View style={styles.commentButton}>
                <Text
                    style={styles.commentButtonText}
                    onPress={this.toComments}
                >添加评论...</Text>
            </View>;
        let currentUser = this.props.currentUser;
        return (
            <View style={styles.commentContainer}>
                <Text style={styles.commentTitle}>评论</Text>
                {commentPreview}
                <View style={styles.commentButtonContainer}>
                    <UserAvatar
                        title={""}
                        source={{uri: currentUser.avatar,}}
                        size={24}
                        id={currentUser.id}
                    />
                    {commentButton}
                </View>
            </View>
        )
    };

    renderFooter = () => {
        let commentIcon =
            <CommentIcon
                color={"#b4b4b4"}
                size={24}
                onPress={this.toComments}
            />;
        let messageIcon = (
            <PaperPlaneIcon
                color={"#b4b4b4"}
                size={24}
                onPress={() => {alert("按到message icon了！")}}
            />
        );
        let editIcon = (
            <EditIcon
                color={"#b4b4b4"}
                size={24}
                onPress={this.toPublishPage}
            />
        );
        let messageOrEditButton = this.props.currentAct.isSelf ?
            (
                <TouchableWithoutFeedback
                    onPress={this.toChatPage}
                >
                    <View>
                        {editIcon}
                        <Text style={styles.bottomIconText}>编辑</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
            :
            (
            <TouchableWithoutFeedback
                onPress={this.toChatPage}
            >
                <View style={styles.bottomRightIcon}>
                    {messageIcon}
                    <Text style={styles.bottomIconText}>私信</Text>
                </View>
            </TouchableWithoutFeedback>
        );
        let commentButton = (
            <TouchableWithoutFeedback
                onPress={this.toComments}
            >
                <View style={styles.bottomRightIcon}>
                    {commentIcon}
                    <Text style={styles.bottomIconText}>评论</Text>
                </View>
            </TouchableWithoutFeedback>
        );
        let footerLeftButton = this.renderFooterLeftButton();
        return (
            <View style={styles.footer}>
                <View style={styles.bottomLeftIconContainer}>
                    {footerLeftButton}
                </View>
                <View style={styles.bottomRightIconContainer}>
                    {messageOrEditButton}
                    {commentButton}
                </View>
            </View>
        )
    };
    renderFooterLeftButton = () => {
        let joinIcon =
            <PlusIcon
                color={"#0084ff"}
                size={24}
            />;
        let joinedIcon =
            <CheckIcon
                color={"#afafaf"}
            />;
        let joinButton = (
            <Button
                icon={joinIcon}
                title={"加入"}
                titleStyle={styles.bottomButtonText}
                contaienrStyle={styles.bottomButtonContainer}
                buttonStyle={styles.bottomButton}
                loading={this.state.isJoining}
                onPress={this.joinAct}
                TouchableComponent={TouchableWithoutFeedback}
            />
        );
        let joiningButton = (
            <Button
                title={"等待同意"}
                titleStyle={styles.bottomButtonText}
                contaienrStyle={styles.bottomButtonContainer}
                buttonStyle={styles.bottomButton}
                disabled
            />
        );
        let joinedButton = (
            <Button
                icon={joinedIcon}
                title={"已加入"}
                titleStyle={styles.bottomButtonText}
                contaienrStyle={styles.bottomButtonContainer}
                buttonStyle={styles.bottomButton}
                disabled
            />
        );
        let footerLeftButton;
        switch (this.state.joinStatus) {
            case -1:
                footerLeftButton = joiningButton;
                break;
            case -2:
                footerLeftButton = joinButton;
                break;
            case 0:
                footerLeftButton = joinedButton;
                break;
            case 1:
                footerLeftButton = joinedButton;
                break;
            default:
                footerLeftButton = joinButton;
        }
        return footerLeftButton;
    };

    // function for jump between b\pages
    toUserPersonalPage = (id) => {
        NavigationUtil.toPage({id:id}, "PersonalHome")
    };
    goBack = () => {
        this.props.resetActDetail() ;
        NavigationUtil.back(this.props)
    };
    toComments = () => {
        let { comments, sponsor } = this.props.currentAct;
        NavigationUtil.toPage({
            comments: comments,
            sponsor: sponsor.nickname
        }, "ActComment");
    };
    toPublishPage = () => {
        let currentAct = this.props.currentAct;
        switch (currentAct.type) {
            case "taxi":
                NavigationUtil.toPage({type: "taxi"}, "PublishPage");
                break;
            case "takeout":
                NavigationUtil.toPage({type: "takeout"}, "PublishPage");
                break;
            case "order":
                NavigationUtil.toPage({type: "order"}, "PublishPage");
                break;
            case "other":
                NavigationUtil.toPage({type: "other"}, "PublishPage");
                break;
            default:
                console.log("invalid type");
        }
    };
    toChatPage = () => {
        console.log("you pressed me!");
    };

    // function for act detail logic
    loadData = (id, jwt, currentUserId, followingList) => {
        this.getUserActStatus(id ,jwt);
        this.props.onLoadActDetail(id, jwt, currentUserId, followingList);
    };
    getUserActStatus = (id, jwt) => {
        Api.getUserActStatus(id, jwt)
            .then(data => {
                this.setState({joinStatus: data.status});
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
    };
    joinAct = () => {
        let jwt = this.props.currentUser.jwt;
        let act = this.props.currentAct;
        this.setState({isJoining: true});
        Api.joinAct(act, jwt)
            .then(() => {
                this.setState({joinStatus: -1})
            })
            .catch(err => {
                console.log(err)
            })
            .finally(
                () => {
                    this.setState({isJoining: false});
                }
            )
    };

    // generate preview comments from given comments
    getPreviewComments = (comments) => {
        let previewComments = [];
        let count = 0;
        for (let i = comments.length - 1; i >= 0 && count < 2; i--) {
            if( comments[i].receiverId === -1 ) {
                previewComments.push(comments[i]);
                count++;
            }
        }
        return previewComments
    };

    follow = () => {
        let currentUser = this.props.currentUser;
        let currentAct = this.props.currentAct;
        if (!currentUser.logged) {
            //...
        } else {
            let from = {
                id: currentUser.id,
            };
            let to = {
                id: currentAct.sponsor.id,
                nickname: currentAct.sponsor.nickname,
                avatar_url: currentAct.sponsor.avatar,
                signature: currentAct.sponsor.signature,
            };
            this.props.onFollow(from, to, currentUser.jwt, this);
        }
    };

    unFollow = () => {
        let currentUser = this.props.currentUser;
        if (!currentUser.logged) {
            //...
        } else {
            let from = {
                id: currentUser.id,
            };
            let to = {
                id: this.props.currentAct.sponsor.id,
            };
            this.props.onUnFollow(from, to, currentUser.jwt, this);
        }
    };
    deleteAct = () => {
        alert("删除还没开发")
    };
    toggleEveningMode = ()　=> {
        alert("没有事情发生")
    };
    _onScroll = () => {

    };
}

const mapStateToProps = state => ({
    currentAct: state.currentAct,
    currentUser: state.currentUser,
    currentUserFollowing: state.currentUserFollowing,
});
const mapDispatchToProps = dispatch => ({
    onLoadActDetail: (actId, jwt, currentUserId, followingList) =>
        dispatch(Activity.onLoadActDetail(actId, jwt, currentUserId, followingList)),
    resetActDetail: () => dispatch(Activity.resetActDetail()),
    onFollow: (from, to, jwt, that) => dispatch(onFollow(from, to, jwt, that)),
    onUnFollow: (from, to, jwt, that) => dispatch(onUnFollow(from, to, jwt, that)),
    saveTaxiAct: data => dispatch(Activity.saveTaxiAct(data)),
    saveTakeoutAct: data => dispatch(Activity.saveTakeoutAct(data)),
    saveOrderAct: data => dispatch(Activity.saveOrderAct(data)),
    saveOtherAct: data => dispatch(Activity.saveOtherAct(data)),
});
export default connect(mapStateToProps ,mapDispatchToProps)(DetailScreen);
const imageWidth = Util.getVerticalWindowDimension().width * 0.4;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:"100%",
        backgroundColor: "#eeeeee",
    },

    // header style, including title, tags
    titleContainer:{
        backgroundColor: "#fff",
        paddingLeft:"6%",
        paddingRight:"6%",
        marginBottom: 10,
    },
    title:{
        fontSize: 24,
        fontWeight: "bold",
        color: "#2a2a2a",
    },
    tagContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        marginTop: 10,
    },

    // body style, including user info, text, images, metadata
    bodyContainer: {
        backgroundColor: "#fff",
        flex: 1,
        width: "100%",
        paddingLeft:"6%",
        paddingRight:"6%",
        marginBottom: 12,
    },
    userInfoContainer: {
        width: "100%",
        padding: 5,
        marginTop: 5,
        marginBottom: 10,
    },
    userInfoTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    userInfoSubtitle: {
        color: "#bbbbbb",
    },
    followBtn: {
        backgroundColor: "#efefef",
        borderRadius: 6,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
    bodyContent: {
        minHeight: 400,
        marginBottom: 40
    },
    bodyText: {
        fontSize: 20,
        lineHeight: 26,
        color: "#505050",
    },
    bodyImage: {
        width: imageWidth,
        height: imageWidth,
        resizeMode: "cover",
    },

    // publish time style
    bodyBottomContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    metadata: {
        color: "#d3d3d3",
        fontSize: 14,
        padding: 8,
    },

    // comment style, including comment title, comment button, comment preview
    commentContainer: {
        width: "100%",
        marginTop: 5,
        marginBottom: 15,
    },
    commentTitle: {
        fontWeight: "800",
        fontSize: 18,
        color: "#1a1a1a",
        marginBottom: 20,
        marginTop: 20,
    },
    commentButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    commentButton: {
        borderWidth: 1,
        borderColor: "#efefef",
        borderRadius: 30,
        justifyContent: "center",
        flex: 1,
        marginLeft: 15
    },
    commentButtonText: {
        fontSize: 14,
        color: "#dadada",
        flex: 1,
        borderRadius: 30,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
    },

    // footer style
    footer: {
        height: 48,
        width: "100%",
        borderTopWidth: 0.5,
        borderTopColor: "#d3d3d3",
        paddingLeft: "6%",
        paddingRight: "6%",
        flexDirection: "row",
        alignItems: "center",
    },
    bottomLeftIconContainer: {
        flex: 2,
    },
    bottomRightIconContainer: {
        flex: 5,
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
    },
    bottomRightIcon: {
        paddingRight: 12,
        paddingLeft: 12,
    },
    bottomButtonContainer: {
        padding: 0,
        backgroundColor: "#b7e2ff",
        borderRadius: 100,
        marginBottom: 15,
    },
    bottomButton: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 100,
        backgroundColor: "#d3eeff",
    },
    bottomButtonText: {
        color: "#0084ff",
        fontSize: 13,
        fontWeight: "700",
    },
    bottomIconText: {
        fontSize: 12,
        color: "#b7b7b7",
    },
});
