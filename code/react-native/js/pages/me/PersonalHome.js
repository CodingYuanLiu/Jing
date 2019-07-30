import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, TouchableOpacity} from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import {ArrowLeftIcon, CaretRightIcon, ChevronIcon, MessageOneToOneIcon, PlusIcon} from "../../common/components/Icons";
import NavigationUtil from "../../navigator/NavUtil";
import Util from "../../common/util";
import {Avatar, Button, Divider, Image} from "react-native-elements";

const window = Util.getVerticalWindowDimension();
const STICKY_HEADER_HEIGHT = 50;
const PARALLAX_HEADER_HEIGHT = 180;

export default class  extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        //this.displayUser = this.props.navigation.getParam("id");
        this.displayUser = -1;
        this.displaySelf = this.props.user && this.displayUser === this.props.user.id;
    }
    displayUser = -1;
    displaySelf = false;

    componentDidMount(){
        console.log(this.props);
    }

    render() {
        let userComponent = this.renderUser();
        let infoComponent = this.renderInfo();
        //let tabNav = this.renderTabNav();
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
            >

                <View style={styles.container}>
                    {userComponent}
                    {infoComponent}
                </View>
            </ParallaxScrollView>
        )
    }
    renderBackground = () => {
        return (
                <Image
                    source={{
                        uri: "http://image.jing855.cn/actImage/act16/img0",
                    }}
                    style={{width: window.width, height: 180}}
                />
        )
    };
    renderStickyHeader = () => {
        let nickname = "赵胜龙";
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
                style={styles.fixedHeaderIcon}
            />
        );
        return (
            <View style={styles.fixedHeaderContainer}>
                {arrowLeftIcon}
            </View>
        )
    };
    renderUser = () => {
        let avatar = (
            <Avatar
            source={{uri: "http://image.jing855.cn/actImage/act16/img0"}}
            rounded
            containerStyle={styles.avatarContainer}
            size={100}
            />
        );
        let rightButton = (
            <Button
                title={this.displaySelf ? "编辑资料" : "关注" }
                icon={
                    this.displaySelf ?
                        null :
                        <PlusIcon
                            color={"#fff"}
                            size={18}
                        />
                }
                containerStyle={styles.userRightButtonContainer}
                buttonStyle={styles.userRightButton}
                TouchableComponent={TouchableWithoutFeedback}
                onPress={() => {NavigationUtil.toPage(null, "Information")}}
            />
        );
        let rightIcon = this.displaySelf? null : (
            <MessageOneToOneIcon
            reverse
            color={"#6a6a6a"}
            reverseColor={"#fff"}
            size={14}
            containerStyle={styles.userRightIconContainer}
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
                    赵胜龙
                </Text>
            </View>
        );
        let signature = (
            <View>
                <Text style={styles.signatureTitle}>
                    这里一无所有，直到你
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
        return null;
    }
}

const styles = StyleSheet.create({
    fixedHeaderContainer: {
        backgroundColor: "transparent",
        height: 50,
        width: window.width,
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        marginLeft: 20,
    },
    fixedHeaderIcon: {
        //marginLeft: 20,
    },
    stickyHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: STICKY_HEADER_HEIGHT,
        backgroundColor: "#5293ff",
    },
    stickyHeaderText: {
        marginLeft: 60,
        color: "#fff",
        fontSize: 20,
    },
    contentContainer: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: "#fff",
        position: "relative",
        top: -10,
    },
    container: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        position: "relative",
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 30,
    },
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
