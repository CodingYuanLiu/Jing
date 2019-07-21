import React from "react";
import {View, Text, StyleSheet, ScrollView, TouchableHighlight} from "react-native"
import NavigationBar from "../../common/components/NavigationBar"
import Api from "../../api/Api"
import {Button, Icon, Image, ListItem, Avatar} from "react-native-elements";
import NavigationUtil from "../../navigator/NavUtil";
import Default from "../../common/constant/Default";
import {CommentIcon, PlusIcon} from "../../common/components/Icons";
import Tag from "../../common/components/Tag";
import Modal from "react-native-modal";
import CommentModal from "./CommentModal";
export default class DetailScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state= {
            activity: {},
            commentVisible: false,
            innerModalVisible: false,
        }
    }

    componentDidMount(){
        let actId = this.props.navigation.getParam("id");
        Api.getActDetail(actId)
            .then(data => {
                this.setState({activity: data})
                console.log(this.state)
            })
            .catch(err => {
                console.log(err)
            })
    }

    renderNavBar = () => {
        let backBtn=
            <Icon
                type={"material-community"}
                name={"keyboard-backspace"}
                color={"#d3d3d3"}
                onPress={() => {NavigationUtil.back(this.props)}}
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
    renderUser = user => {
        let nickname = user.nickname;
        let avatarUri = user.avatarUri;
        let signature = user.signature;
        let followBtn =
            <Button
                title={"关注"}
                icon={
                    <PlusIcon
                        size={24}
                        color={"#0084ff"}
                    />
                }
                titleStyle={{color: "#0084ff"}}
                buttonStyle={styles.followBtn}
            />;
        return (
            <ListItem
                leftAvatar={{
                    source: {uri: avatarUri === "" ? Default.DEFAULT_AVATAR : avatarUri},
                    size: 36
                }}
                title={nickname}
                containerStyle={styles.userInfoContainer}
                contentContainerStyle={{position: "relative", left: -5}}
                titleStyle={styles.userInfoTitle}
                subtitle={signature}
                subtitleProps={{ellipsizeMode: "tail", numberOfLines: 1}}
                subtitleStyle={styles.userInfoSubtitle}
                titleProps={{numberOfLines: 1, ellipsizeMode: "tail"}}
                rightElement={followBtn}
            />
        )
    }
    renderBody = (user, specInfo, bodyText, images, publishTime, comments) => {
        let comment = this.renderComment(comments, user);
        let userComponent = this.renderUser(user);
        return (
            <View style={styles.bodyContainer}>
                <View style={styles.bodyContent}>
                    {userComponent}
                    <View style={styles.bodyTextContainer}>
                        <Text style={styles.bodyText}>{bodyText}</Text>
                    </View>
                    <View style={styles.bodyImage}>
                        {
                            images && images.length > 0 && images.map((item, i) => (
                                <Image
                                    source={{uri: item}}
                                />
                            ))
                        }
                    </View>
                    <View style={styles.bodyBottomContainer}>
                        <Text style={styles.metadata}>发布于{publishTime}</Text>
                    </View>
                </View>
                <View>
                    {comment}
                </View>
            </View>

        )
    };

    renderCommentPreview = (comments) => {
        return null
    };
    renderComment = (comments, author) => {
        let commentPreview = this.renderCommentPreview(comments);
        let commentButton =
            <View style={styles.commentButton}>
                <Text style={styles.commentButtonText}>添加评论...</Text>
            </View>
        return (
            <View style={styles.commentContainer}>
                <Text style={styles.commentTitle}>评论</Text>
                {commentPreview}
                <View style={styles.commentButtonContainer}>
                    <Avatar
                        source={{uri: author.avatarUri,}}
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
            />
        let joinIcon =
            <PlusIcon
                color={"#0084ff"}
                size={24}
            />
        return (
            <View style={styles.footer}>
                <View style={styles.bottomLeftIconContainer}>
                    <Button
                        icon={joinIcon}
                        title={"加入"}
                        titleStyle={styles.bottomButtonText}
                        contaienrStyle={styles.bottomButtonContainer}
                        buttonStyle={styles.bottomButton}
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
    }

    render() {
        let activity = this.state.activity;
        let title = activity.title;
        let comments = activity.comments;
        let bodyText = activity.description;
        let tag = activity.tag;
        let images = activity.images;
        let publishTime = activity.create_time;
        let user={
            avatarUri: activity.sponsor_avatar ? activity.sponsor_avatar : Default.DEFAULT_AVATAR,
            nickname: activity.sponsor_username,
            id: activity.sponsor_id,
            signature: activity.signature,
        };
        let specInfo = {};
        let navBar = this.renderNavBar();
        let header = this.renderHeader(title, tag);
        let body = this.renderBody(user, specInfo, bodyText, images, publishTime, comments);
        let footer = this.renderFooter();
        return(
            <View style={{flex:1, alignItems:"center"}}>
                {navBar}
                <ScrollView style={[{flex: 1}, styles.container]}>
                    {header}
                    {body}
                </ScrollView>
                {footer}
                <Modal isVisible={this.state.commentVisible}>
                    <CommentModal/>
                </Modal>
            </View>
        );
    };

    toUserPersonalPage = () => {
        let id = this.state.activity.sponsor_id;
        NavigationUtil.toPage({id:id}, "PersonalPage")
    };

};



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
        fontSize: 21,
        fontWeight: "600",
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
        minHeight: 800,
    },
    bodyTextContainer: {
    },
    bodyText: {
        fontSize: 14,
        color: "#505050",
    },
    bodyImage: {

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
