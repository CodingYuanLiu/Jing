import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Animated} from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import {ArrowLeftIcon, ChevronIcon, MessageOneToOneIcon, PlusIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import Util from "../../common/util";
import {Avatar, Button, Divider, Image} from "react-native-elements";
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
            followed: false,
            privacy: 0,
            avatarVisible: false,
            backgroundVisible: false,
            avatar: {},
            background: {},
        };
    }

    componentDidMount(){
        let id = this.props.navigation.getParam("id");
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
                scrollEventListener={this.toggleNestScroll}
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
                        `data:base64;${background.type},${background.data}` :
                            "http://image.jing855.cn/actImage/act16/img0"
                        ,
                    }}
                    style={{width: window.width, height: BACKGROUND_IMAGE_HEIGHT}}
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
        console.log(this._scroll);
        return (
            <Animated.ScrollView
                scrollEnabled={!personalHome.nestScrollEnabled}
                ref={"_scroll"}
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
                    `data:base64;${newAvatar.type},${newAvatar.data}`
                        : user.avatar
                }}
                rounded
                containerStyle={styles.avatarContainer}
                size={100}
                onPress={this.showAvatarPicker}
            />
        );
        let rightButton = (
            <Button
                title={this.state.isSelf ? "编辑资料" : "关注" }
                icon={
                    this.state.isSelf ?
                        null :
                        <PlusIcon
                            color={"#fff"}
                            size={18}
                        />
                }
                //containerStyle={styles.userRightButtonContainer}
                buttonStyle={styles.userRightButton}
                TouchableComponent={TouchableWithoutFeedback}
                onPress={this.state.isSelf ?
                    () => {NavigationUtil.toPage({user: user}, "ModifyInformation")} :
                    () => {this.follow(user.id)}
                }
            />
        );
        let rightIcon = this.state.isSelf? null : (
            <MessageOneToOneIcon
                reverse
                color={"#6a6a6a"}
                reverseColor={"#fff"}
                size={14}
                containerStyle={styles.userRightIconContainer}
                onPress={() => {alert("去聊天吗")}}
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
            <View>
                <Text style={styles.nicknameTitle}>
                    {user.nickname}
                </Text>
            </View>
        );
        let signature = (
            <View>
                <Text style={styles.signatureTitle}>
                    {user.signature === "" ? "这里一无所有，直到你" : user.signature}
                </Text>
            </View>
        );
        return (
            <View>
                {avatarComponent}
                {nickname}
                {signature}
            </View>
        )
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
                    该用户由于违反协议规定，现在暂时处于禁言状态
                </Text>
            </View>
        );
        let information = (
            <View style={styles.informationRowContainer}>
                <Text style={[styles.informationItem, {borderRightWidth: 0.5, borderColor: "#dfdfdf"}]}>软件工程专业</Text>
                <Text style={styles.informationItem}>大二</Text>
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
                />
            </View>
        );
        return (
            <View>
                {data}
                {status}
                {information}
            </View>
        );
    };
    renderTabNav = () => {
        return <PersonalTab/>;
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

                this.setState({
                    avatar: {
                        data: data,
                        type: type,
                    },
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
});
const mapDispatchToProps = dispatch => ({
    getPersonalFeedback: (id) => dispatch(getPersonalFeedback(id)),
    getPersonalManageAct: (id, jwt) => dispatch(getPersonalManageAct(id, jwt)),
    getPersonalInformation: (id) => dispatch(getPersonalInformation(id)),
    toggleNestScroll: (flag) => dispatch(toggleNestScroll(flag)),
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
