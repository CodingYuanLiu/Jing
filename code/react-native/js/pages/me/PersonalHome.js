import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Animated} from "react-native";
import ParallaxScrollView from "../../common/components/ParallaxScrollView/index";
import {ArrowLeftIcon, ChevronIcon, MessageOneToOneIcon, PlusIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import Util from "../../common/util";
import {Avatar, Button, Divider, Image, Rating} from "react-native-elements";
import {connect} from "react-redux";
import ImagePicker from "react-native-image-picker";
import Api from "../../api/Api";
import PersonalTab from "./PersonalTab/PersonalTab";
import {
    getPersonalFeedback,
    getPersonalInformation,
    getPersonalManageAct,
    toggleNestScroll
} from "../../actions/personalHome";
import {onFollow, onUnFollow} from "../../actions/currentUserFollowing";
import {CHAT_TYPE, GENDER_FEMALE, GENDER_SECRET} from "../../common/constant/Constant";
import {updateUserInfo} from "../../actions/currentUser";

const window = Util.getVerticalWindowDimension();
const STICKY_HEADER_HEIGHT = 50;
const PARALLAX_HEADER_HEIGHT = 180;
const BACKGROUND_IMAGE_HEIGHT = 180;

class PersonalHome extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            isSelf: false,
            isFriends: false,
            followed: false,
            privacy: 0,
            avatarVisible: false,
            backgroundVisible: false,
            avatar: {},
            background: {},
            isFollowing: false,
            isUnFollowing: false,
        };
    }

    componentDidMount(){
        let id = this.props.navigation.getParam("id");
        let isFriends = false;
        for (let item of this.props.currentUserFollowing.items) {
            if (item.id === id) {
                isFriends = true;
                break;
            }
        }
        if (id === this.props.currentUser.id) {
            this.setState({
                user: this.props.currentUser,
                isSelf: true,
            })
        } else {
            this.loadData(id)
                .catch(err => {console.log(err)});
            this.setState({
                isSelf: false,
                isFriends: isFriends,
            })
        }
        this.props.getPersonalManageAct(id, this.props.currentUser.jwt);
        this.props.getPersonalFeedback(id);
    };

    render() {
        let userComponent = this.renderUser();
        let infoComponent = this.renderInfo();
        let personalTab = this.renderTabNav();
        return (
            <ParallaxScrollView
                parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
                renderStickyHeader={this.renderStickyHeader}
                renderFixedHeader={this.renderFixedHeader}
                renderBackground={this.renderBackground}
                stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                contentBackgroundColor={"transparent"}
                contentContainerStyle={styles.contentContainer}
                backgroundColor={"transparent"}
                renderScrollComponent={this.renderScrollElement}
                scrollEvent={this.toggleNestScroll}
            >

                <View style={styles.container}>
                    <View style={styles.topContainer}>
                        {userComponent}
                        {infoComponent}
                    </View>
                    {personalTab}
                </View>
            </ParallaxScrollView>
        )
    }
    renderBackground = () => {
        let background = this.state;
        return (
            <TouchableWithoutFeedback
                onPress={this.showBackgroundPicker}
            >
                <Image
                    source={{
                        uri: background.data ?
                        `data:${background.type};base64,${background.data}` :
                            "https://pic1.zhimg.com/v2-3b4fc7e3a1195a081d0259246c38debc_1200x500.jpg"
                        ,
                    }}
                    style={{width: window.width, height: BACKGROUND_IMAGE_HEIGHT, zIndex: 10}}
                />
            </TouchableWithoutFeedback>
        )
    };
    renderStickyHeader = () => {
        let nickname = this.state.user.nickname;
        return (
            <View style={styles.stickyHeaderContainer}>
                <Text style={styles.stickyHeaderText}>{nickname}</Text>
            </View>
        )
    };
    renderFixedHeader = () => {
        let arrowLeftIcon = (
            <ArrowLeftIcon
                color={"#fff"}
                onPress={() => {NavigationUtil.back(this.props)}}
            />
        );
        return (
            <View style={styles.fixedHeaderContainer}>
                {arrowLeftIcon}
            </View>
        )
    };
    renderScrollElement = () => {
        let {personalHome} = this.props;
        return (
            <Animated.ScrollView
                scrollEnabled={!personalHome.nestScrollEnabled}
            />
        )
    };
    renderUser = () => {
        let user = this.state.user;
        let newAvatar = this.state.avatar;
        let avatar = (
            <Avatar
                source={{
                    uri: newAvatar.data ?
                    `data:${newAvatar.type};base64,${newAvatar.data}`
                        : user.avatar
                }}
                rounded
                containerStyle={styles.avatarContainer}
                size={100}
                onPress={this.showAvatarPicker}
            />
        );
        let rightButton = this.renderUserRightButton();
        let rightIcon = this.state.isSelf? null : (
            <MessageOneToOneIcon
                reverse
                color={"#6a6a6a"}
                reverseColor={"#fff"}
                size={14}
                containerStyle={styles.userRightIconContainer}
                onPress={this.toPrivateMessage}
            />
        );
        let avatarComponent = (
            <View style={styles.userTopContainer}>
                {avatar}
                {rightButton}
                {rightIcon}
            </View>
        );
        let nickname = (
            <Text style={styles.nicknameTitle}>
                {user.nickname}
            </Text>
        );
        let signature = (
            <Text style={styles.signatureTitle}>
                {user.signature}
            </Text>
        );
        return (
            <View>
                {avatarComponent}
                {nickname}
                {signature}
            </View>
        )
    };
    renderUserRightButton = () => {
        let title, onPress;
        if (this.state.isSelf) {
            title="编辑资料";
            onPress = this.toModifyInformation;
        } else {
            if (this.state.isFriends) {
                return (
                    <Button
                        title={"已关注"}
                        titleStyle={{color: "#0084ff"}}
                        buttonStyle={[styles.userRightButton, {backgroundColor: "#eee"}]}
                        TouchableComponent={TouchableWithoutFeedback}
                        loading={this.state.isUnFollowing}
                        onPress={this.unFollow}
                    />
                )
            } else {
                title = "关注";
                onPress = this.follow;
            }
        }
        return  (
            <Button
                title={title}
                icon={
                    this.state.isSelf ?
                        null :
                        <PlusIcon
                            color={"#fff"}
                            size={18}
                        />
                }
                buttonStyle={styles.userRightButton}
                loading={this.state.isFollowing}
                TouchableComponent={TouchableWithoutFeedback}
                onPress={onPress}
            />
        );
    };
    renderInfo = () => {
        let fans = 200;
        let follow = 58;
        let data = (
            <View style={styles.dataContainer}>
                <View style={styles.dataLabelContainer}>
                    <Text style={styles.data}>{fans}</Text>
                    <Text style={styles.label}>关注他的人</Text>
                </View>
                <View style={styles.dataLabelContainer}>
                    <Text style={styles.data}>{follow}</Text>
                    <Text style={styles.label}>他关注的人</Text>
                </View>
            </View>
        );
        let status = (
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                    该用户由于违反<Text　style={{color: "#0084ff"}}>协议规定</Text>，现在暂时处于禁言状态
                </Text>
            </View>
        );
        let information = this.renderInfoPreview();
        let feedbackCount = this.renderFeedbackCount();
        return (
            <View>
                {data}
                {this.state.user.status ? status : null}
                {information}
                {feedbackCount}
            </View>
        );
    };
    renderInfoPreview = () => {
        let user = this.state.user;
        let {firstText, secondText} = this.generateInfoPreviewText(user);
        if (!firstText) return null;
        return (
            <View style={styles.informationRowContainer}>
                <Text style={[styles.informationItem, secondText ? {borderRightWidth: 0.5, borderColor: "#dfdfdf"} : null]}>
                    {firstText}
                </Text>
                <Text style={styles.informationItem}>
                    {secondText}
                </Text>
                <Button
                    icon={
                        <ChevronIcon
                            color={"#bfbfbf"}
                        />
                    }
                    iconRight
                    type={"clear"}
                    title={"详细资料"}
                    titleStyle={{color: "#bfbfbf"}}
                    TouchableComponent={TouchableWithoutFeedback}
                    onPress={this.toPersonalInformationPage}
                />
            </View>
        );
    };
    renderFeedbackCount = () => {
        let ratingCount;
        let { personalHome } = this.props;
        let sum = 0, num = 0;
        for (let item of personalHome.feedbackList) {
            sum += item.communication.data + item.honesty.data + item.punctuality.data;
            num++;
        }
        ratingCount = sum / num / 3;
        let user = this.state.user;
        return (
            <View style={styles.ratingContainer}>
                <Rating
                    ratingCount={5}
                    startingValue={ratingCount}
                    readonly={true}
                    imageSize={30}
                />
                <Text style={{fontSize: 18, color: "#f1c40f"}}>  ({personalHome.feedbackList.length}个人评价{user.gender === 0 ? "她": "他"})</Text>
            </View>
        )
    };
    renderTabNav = () => {
        return <PersonalTab/>;
    };
    generateInfoPreviewText = (user) => {
        let firstText = null, secondText = null;
        if (user.dormitory && user.dormitory !== "") {
            if (!firstText) {
                firstText = user.dormitory;
            } else {
                secondText = user.dormitory;
            }
        }
        if (user.major && user.major !== "") {
            if (!firstText) {
                firstText = user.major;
            } else {
                secondText = user.major;
            }
        }
        if (user.gender && user.gender !== GENDER_SECRET) {
            if (!firstText) {
                firstText = user.gender === GENDER_FEMALE ? "小仙女" : "男孩子";
            } else {
                secondText = user.gender === GENDER_FEMALE ? "小仙女" : "男孩子";
            }
        }
        return {
            firstText,
            secondText,
        }
    };
    showAvatarPicker = () => {
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                // ... do nothing
            } else if (response.error) {
                console.log('Avatar picker error: ', response.error);
            } else {
                let data = response.data;
                let type = response.type;
                this.setState(state => {
                    return {
                        ...state,
                        avatar: {
                            data: data,
                            type: type,
                        }
                    }
                });
                Api.updateAvatar(data, this.props.currentUser.jwt)
                    .then(data => {
                        console.log(data);
                        this.props.updateUserInfo(data);
                    })
                    .catch(err => {

                    });

            }
        });
    };
    showBackgroundPicker = () => {
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                // ... do nothing
            } else if (response.error) {
                console.log('Background picker error: ', response.error);
            } else {
                let data = response.data;
                let type = response.type;

                this.setState({
                    background: {
                        data: data,
                        type: type,
                    },
                });
            }
        });
    };
    loadData = async (id) => {
        try {
            let data = await Api.getUserInfo(id);
            console.log(data);
            this.setState({user: data});
        } catch (err) {
            console.log(err)
        }

    };
    toggleNestScroll = ({nativeEvent}) => {
        let {contentOffset, layoutMeasurement, contentSize} = nativeEvent;
        let {toggleNestScroll} = this.props;

        if (contentSize.height - contentOffset.y <= layoutMeasurement.height) {
            toggleNestScroll(true);
        } else {
            toggleNestScroll(false);
        }
    };
    toModifyInformation = () => {
        NavigationUtil.toPage(null, "ModifyInformation");
    };
    toPersonalInformationPage = () => {
        NavigationUtil.toPage({user: this.state.user}, "PersonalInformation");
    };
    toPrivateMessage = () => {
        NavigationUtil.toPage({receiver: this.state.user, type: CHAT_TYPE.PRIVATE_CHAT}, "ChatPage");
    };
    follow = () => {
        let currentUser = this.props.currentUser;
        if (!currentUser.logged) {
            //...
        } else {
            let from = {
                id: currentUser.id,
            };
            let to = {
                id: this.props.navigation.getParam("id"),
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
                id: this.props.navigation.getParam("id"),
            };
            this.props.onUnFollow(from, to, currentUser.jwt, this);
        }
    };
}
const imagePickerOptions = {
    title: "选择",
    cancelButtonTitle: "取消",
    takePhotoButtonTitle: "拍摄",
    chooseFromLibraryButtonTitle: "从相册选择",
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quality: 0.4,
};
const mapStateToProps = state => ({
    currentUser: state.currentUser,
    personalHome: state.personalHome,
    currentUserFollowing: state.currentUserFollowing,
});
const mapDispatchToProps = dispatch => ({
    getPersonalFeedback: (id) => dispatch(getPersonalFeedback(id)),
    getPersonalManageAct: (id, jwt) => dispatch(getPersonalManageAct(id, jwt)),
    getPersonalInformation: (id) => dispatch(getPersonalInformation(id)),
    toggleNestScroll: (flag) => dispatch(toggleNestScroll(flag)),
    onFollow: (from, to, jwt, that) => dispatch(onFollow(from, to, jwt, that)),
    onUnFollow: (from, to, jwt, that) => dispatch(onUnFollow(from, to, jwt, that)),
    updateUserInfo: (data) => dispatch(updateUserInfo(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PersonalHome);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        position: "relative",
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 30,
    },
    fixedHeaderContainer: {
        backgroundColor: "transparent",
        height: STICKY_HEADER_HEIGHT,
        width: window.width,
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        marginLeft: 20,
    },
    stickyHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: STICKY_HEADER_HEIGHT,
        backgroundColor: "#0084ff",
    },
    stickyHeaderText: {
        marginLeft: 60,
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    contentContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: "#fff",
    },

    // top user information container
    userTopContainer: {
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        height: 50,
        position: "relative",
        paddingRight: 10,
    },
    ratingContainer: {
        marginTop: 15,
        marginBottom: 15,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    avatarContainer: {
        padding: 2,
        backgroundColor: "#fff",
        position: "absolute",
        top: -50,
        left: 0,
    },
    userRightButtonContainer: {
        marginRight: 10,
        borderRadius: 20,
        width: 100,
        height: 32,
    },
    userRightButton: {
        borderRadius: 20,
        width: 100,
        height: 32,
        marginBottom: 2,
    },
    userRightIconContainer: {
        marginBottom: -5,
    },
    nicknameTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#3a3a3a",
    },
    signatureTitle: {
        fontSize: 12,
        color: "#bfbfbf",
        marginBottom: 10,
        paddingLeft: 8,
    },

    // style for user data, including follows and fans
    dataContainer: {
        flexDirection: "row",
    },
    dataLabelContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginRight: 16,
    },
    data: {
        color: "#0084ff",
        fontWeight: "800",
        fontSize: 24,
        paddingRight: 3,
        padding: 0,
    },
    label: {
        fontSize: 12,
        color: "#afafaf",
        paddingBottom: 4,
    },

    // style for user status, render when user is forbidden to publish
    statusContainer: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",
    },
    statusText: {
        color: "#ff5234",
        fontSize: 16,
    },
    buttonText: {
        color: "#0084ff",
        fontSize: 16,
    },

    // style for user information, render when user information is not empty string
    informationRowContainer: {
        height: 40,
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderColor: "#bfbfbf",
        alignItems: "center",
        justifyContent: "space-between",
    },
    informationItem: {
        fontSize: 16,
        color: "#3a3a3a",
        marginTop: 14,
        marginBottom: 14,
        paddingRight: 18,
    },
});
