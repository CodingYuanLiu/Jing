import React from "react";
import {View, Text, StyleSheet, ScrollView, TouchableHighlight} from "react-native"
import NavigationBar from "../../common/components/NavigationBar"
import {Button, Icon, Image, ListItem, Avatar} from "react-native-elements";
import NavigationUtil from "../../navigator/NavUtil";
import {CommentIcon, PlusIcon} from "../../common/components/Icons";
import Tag from "../../common/components/Tag";
import Activity from "../../actions/activity";
import {connect} from "react-redux";
import Util from "../../common/util";
import Api from "../../api/Api";
import CommentPreview from "./components/CommentPreview";
import {onFollow, onUnFollow} from "../../actions/currentUser";

class DetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            activity: {},
            isLoading: false,
            isFriends: false,
        }
    }

    componentDidMount(){
        this.actId = this.props.navigation.getParam("id");
        this.loadData(this.actId);
    }
    loadData = (id) => {
        this.props.onLoadActDetail(id);
    };
    render() {
        let activity = this.props.currentAct;
        let {title, comments, tag, images,
            createTime, description, sponsor} = activity;
        let specInfo = {};
        let navBar = this.renderNavBar();
        let header = this.renderHeader(title, tag);
        let body = this.renderBody(sponsor, specInfo, description, images, createTime, comments);
        let footer = this.renderFooter();
        return(
            <View style={{flex:1, alignItems:"center", width:"100%"}}>
                {navBar}
                <ScrollView style={styles.container}>
                    {header}
                    {body}
                </ScrollView>
                {footer}
            </View>
        );
    };
    renderNavBar = () => {
        let backBtn=
            <Icon
                type={"material-community"}
                name={"keyboard-backspace"}
                color={"#d3d3d3"}
                onPress={this.goBack}
            />;
        return(
            <NavigationBar
                leftButton={backBtn}
                style={
                    {
                        backgroundColor: "#fff",
                        alignSelf: "flex-start",
                        marginLeft: 12,
                    }
                }
            />
        );
    };

    renderHeader = (title, tags) => {
        return (
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                </View>
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
                    <View style={styles.bodyTextContainer}>
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
        let isFriends = false;
        console.log(this.props.currentUser.followingList, sponsor);
        if (this.props.currentUser.followingList) {
            for (let item of this.props.currentUser.followingList) {
                if (item.id === sponsor.id) {
                    isFriends = true;
                    break;
                }
            }
        }
        let followBtn =
            isFriends ?
            <Button
                title={"取消关注"}
                titleStyle={{color: "#0084ff"}}
                buttonStyle={styles.followBtn}
                onPress={this.unFollow}
                loading={this.props.follow.isLoading}

            />:
                <Button
                    title={"关注"}
                    titleStyle={{color: "#9a9a9a"}}
                    buttonStyle={styles.followBtn}
                    onPress={this.follow}
                    loading={this.props.follow.isLoading}
                    icon={
                        <PlusIcon
                            size={24}
                            color={"#0084ff"}
                        />
                    }
                />;
        return (
            <ListItem
                leftAvatar={{
                    source: {uri: sponsor.avatar === "" ? null : sponsor.avatar },
                    title: "头像",
                    size: 36
                }}
                title={sponsor.nickname}
                containerStyle={styles.userInfoContainer}
                contentContainerStyle={{position: "relative", left: -5}}
                titleStyle={styles.userInfoTitle}
                subtitle={sponsor.signature}
                subtitleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                subtitleStyle={styles.userInfoSubtitle}
                titleProps={{numberOfLines: 1, ellipsizeMode: "tail"}}
                rightElement={followBtn}
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
                            avatar={comment.user_avatar}
                            content={comment.content}
                            nickname={comment.user_nickname}
                            key={i}
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
                    <Avatar
                        source={{uri: currentUser.avatar,}}
                        rounded
                        size={24}
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
        let joinIcon =
            <PlusIcon
                color={"#0084ff"}
                size={24}
            />;
        return (
            <View style={styles.footer}>
                <View style={styles.bottomLeftIconContainer}>
                    <Button
                        icon={joinIcon}
                        title={"加入"}
                        titleStyle={styles.bottomButtonText}
                        contaienrStyle={styles.bottomButtonContainer}
                        buttonStyle={styles.bottomButton}
                        loading={this.state.isJoining}
                        onPress={this.joinAct}
                    />
                </View>
                <View style={styles.bottomRightIconContainer}>
                    <TouchableHighlight>
                        <View>
                            {commentIcon}
                            <Text style={styles.bottomIconText}>评论</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    };
    toUserPersonalPage = () => {
        //let id = this.state.activity.sponsor_id;
        //NavigationUtil.toPage({id:id}, "PersonalPage")
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
    joinAct = () => {
        let jwt = this.props.user.jwt;
        let actId = this.actId;
        this.setState({isJoining: true});
        Api.joinAct(actId, jwt)
            .then(message => {
                console.log(message);
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
        let previewComments = new Array();
        let count = 0;
        for (let i = comments.length - 1; i >= 0 && count < 2; i--) {
            if( comments[i].receiver_id === -1 ) {
                previewComments.push(comments[i]);
                count++;
            }
        }
        return previewComments
    };

    follow = () => {
        let user = this.props.currentUser;
        let currentAct = this.props.currentAct;
        if (!user.logged) {
            //...
        } else {
            console.log(user);
            let from = {
                id: user.id,
            };
            let to = {
                id: currentAct.sponsor.id,
                nickname: currentAct.sponsor.nickname,
                avatar_url: currentAct.sponsor.avatar,
                signature: currentAct.sponsor.signature,
            };
            console.log(currentAct);
            this.props.onFollow(from, to, user.jwt);
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
            this.props.onUnFollow(from, to, currentUser.jwt);
        }
    }
}

const mapStateToProps = state => ({
    currentAct: state.currentAct,
    currentUser: state.currentUser,
    follow: state.follow,
});
const mapDispatchToProps = dispatch => ({
    onLoadActDetail: actId => dispatch(Activity.onLoadActDetail(actId)),
    resetActDetail: () => dispatch(Activity.resetActDetail()),
    onFollow: (from, to, jwt) => dispatch(onFollow(from, to, jwt)),
    onUnFollow: (from, to, jwt) => dispatch(onUnFollow(from, to, jwt)),
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
    header:{
        backgroundColor: "#fff",
        paddingLeft:"6%",
        paddingRight:"6%",
        marginTop: 5,
        marginBottom: 10,
    },
    titleContainer:{
        flex:1,
        marginTop: 10,
        marginBottom: 16,

    },
    title:{
        fontSize: 24,
        fontWeight: "800",
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
    bodyTextContainer: {
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
        flexDirection: "row",
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
})
