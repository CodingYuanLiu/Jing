import React from "react"
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import OnlineUserCard from "./components/OnlineUserCard"
import { Divider, ListItem, Badge} from "react-native-elements";
import UserDataItem from "./components/UserDataItem";
import NavigationUtil from '../../navigator/NavUtil';
import OfflineUserCard from './components/OfflineUserCard';
import { connect } from "react-redux"
import { Button } from 'react-native-elements';
import {setUserData} from '../../actions/currentUser';
import {SearchIcon, SettingIcon} from "../../common/components/Icons";
import Theme from "../../common/constant/Theme";
import LocalApi from "../../api/LocalApi";

class MeScreen extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            recentData: 0,
        }
    }
    componentDidMount() {
        this.getRecentData();
    }

    render() {
        let header = this.renderHeader();
        let userCard = this.renderUserCard();
        let actMenu = this.renderActMenu();
        let helpMenu = this.renderHelpMenu();
        return(
            <ScrollView style={styles.container}>
                <View style={styles.leftCover} />
                <View style={styles.rightCover}/>
                {header}
                {userCard}
                {actMenu}
                {helpMenu}
            </ScrollView>
        )
    };
    renderHeader = () => {
        let leftElement = (
            <Button
                title={"搜索即应"}
                titleStyle={styles.headerTitle}
                icon={
                    <SearchIcon
                    color={"#7ecaff"}
                    />
                }
                buttonStyle={styles.headerSearch}
                containerStyle={styles.headerSearchContainer}
                TouchableComponent={TouchableWithoutFeedback}
            />
        );
        let settingIcon = (
            <SettingIcon
            color={"#fff"}
            onPress={() => {NavigationUtil.toPage(null, "Setting")}}
            />
        );
        return (
            <View style={styles.headerContainer}>
                {leftElement}
                {settingIcon}
            </View>
        )
    };
    renderUserCard = () => {
        let { currentUser } = this.props;
        let topCard, userData;
        let recentScanData = this.state.recentData;
        let dataList = [
            {data: 0, label: "我的活动",
                onPress: () => {NavigationUtil.toPage(null, "MyAct")}},
            {data: currentUser.followingList.length, label: "关注",
                onPress: () => {NavigationUtil.toPage({userId: this.props.currentUser.id}, "Following")}
            },
            {data: currentUser.followerList.length, label: "粉丝",
                onPress: () => {NavigationUtil.toPage({userId: this.props.currentUser.id}, "Follower")}
            },
            {data: recentScanData, label: "最近浏览",
                onPress: () => {NavigationUtil.toPage(null, "RecentScan")}
            }
        ];
        if (currentUser.logged) {
            topCard = (
                <OnlineUserCard
                    avatar={currentUser.avatar}
                    onPress={this.toUserHome}
                    nickname={currentUser.nickname}
                    signature={currentUser.signature}
                />
            )
        } else {
            topCard = (
                <OfflineUserCard/>
            )
        }
        userData = (
            <View style={styles.userDataContainer}>
                {
                    dataList.map((item, i) => {
                        return (
                            <UserDataItem
                                data={item.data}
                                label={item.label}
                                key={i.toString()}
                                dataContainer={
                                    i === 3 ? null :
                                        {borderRightWidth: 0.5, borderColor: "#efefef"}
                                }
                                onPress={item.onPress}
                            />
                        )
                    })
                }
            </View>
        );
        return (
            <View style={styles.userCardContainer}>
                {topCard}
                {userData}
            </View>
        )
    };

    renderActMenu = () => {
        return (
            <View style={styles.actContainer}>
                <ListItem
                title={"我的活动"}
                chevron
                onPress={() => {NavigationUtil.toPage(null, "MyAct")}}
                />
                <ListItem
                title={"正在参与"}
                chevron
                onPress={() => {NavigationUtil.toPage(null, "MyCurrentAct")}}
                />
                <ListItem
                title={"已结束"}
                chevron
                onPress={() => {NavigationUtil.toPage(null, "MyFinishAct")}}
                />
            </View>
        )
    };
    renderHelpMenu = () => {
        return (
            <View style={styles.helpContainer}>
                <ListItem
                title={"客服中心"}
                chevron
                />
                <ListItem
                title={"反馈"}
                chevron
                />
                <ListItem
                title={"用户满意度调研"}
                chevron
                />
                <ListItem
                title={"去评价"}
                />
            </View>
        )
    };

    toUserHome = () => {
        NavigationUtil.toPage({id: this.props.currentUser.id}, "PersonalHome")
    };
    getRecentData = () => {
        LocalApi.getRecentScan()
            .then((data) => {
                console.log(" in me, update");
                this.setState({recentData: data.length});
            })
            .catch(err => {
                console.log(" in me, err" +
                    "");
                console.log(err);
            })
    }
}
const mapStateToProps = state => ({
    currentUser: state.currentUser
});

const mapDispatchToProps = dispatch => ({
    setUserData: (user) => dispatch(setUserData(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MeScreen)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ebebeb",
    },
    leftCover: {
        backgroundColor: "#0084ff",
        top: 0,
        left: -50,
        position: "absolute",
        height: 160,
        width: "100%",
        borderBottomLeftRadius: 100,
    },
    rightCover: {
        backgroundColor: "#0084ff",
        top: 0,
        right: -50,
        position: "absolute",
        height: 160,
        width: "100%",
        borderBottomRightRadius: 100,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 12,
        marginRight: 12,
        marginTop: 16,
        marginBottom: 10,
    },
    headerTitle: {
        color: "#7ecaff",
        fontSize: 15,
    },
    headerSearchContainer: {
        flex: 1,
        marginRight: 20,
        borderRadius: 10,
    },
    headerSearch: {
        backgroundColor: Theme.DEEP_BLUE,
    },

    // style for user card
    userCardContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginLeft: 12,
        marginRight: 12,
    },
    userDataContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 16,
    },

    //activity menu container
    actContainer: {
        width: "100%",
        marginTop: 10,
    },
    // help menu container
    helpContainer: {
        width: "100%",
        marginTop: 10,
        marginBottom: 5,
    },
});